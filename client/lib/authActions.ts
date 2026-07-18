import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { auth } from "./firebase";

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:8081";

export interface OnboardingStatus {
  isNew: boolean;
  skillLevel: string;
  entranceTestStatus: string; // "" | "in_progress" | "completed"
  entranceTestRound: number;
}

export type AuthResult =
  | { success: true; user: User; isNew: boolean; onboarding: OnboardingStatus }
  | { success: false; message: string };

/**
 * Calls the gateway's login endpoint, which upserts the user and returns
 * onboarding status inline (is_new, skill_level, entrance test attempt) —
 * this lets the caller route straight to /onboarding or /dashboard without
 * a separate profile fetch + redirect hop (which caused a visible flash).
 */
async function callGatewayLogin(user: User): Promise<OnboardingStatus> {
  const idToken = await user.getIdToken();
  const res = await fetch(`${GATEWAY_URL}/api/users/login`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const msg = (await res.text()).trim();
    throw new Error(msg || `Gateway error ${res.status}`);
  }
  const data = await res.json();
  // Go's encoding/json `omitempty` strips zero-value fields (false, "", 0)
  // from the response entirely, so an absent key means the falsy default —
  // not "unknown". Boolean(undefined) correctly resolves to false here.
  return {
    isNew: Boolean(data.is_new ?? data.isNew),
    skillLevel: data.skill_level ?? data.skillLevel ?? "",
    entranceTestStatus: data.entrance_test_status ?? data.entranceTestStatus ?? "",
    entranceTestRound: data.entrance_test_round ?? data.entranceTestRound ?? 0,
  };
}

export async function authenticateWithEmail(
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    // 1. Try to sign in
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const onboarding = await callGatewayLogin(cred.user);
      return {
        success: true,
        user: cred.user,
        isNew: onboarding.isNew,
        onboarding,
      };
    } catch (signInErr: any) {
      // 2. If sign-in fails, try to create the account
      try {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await sendEmailVerification(cred.user, {
          url: `${window.location.origin}/login`,
          handleCodeInApp: false,
        });
        const onboarding = await callGatewayLogin(cred.user);
        return {
          success: true,
          user: cred.user,
          isNew: onboarding.isNew,
          onboarding,
        };
      } catch (createErr: any) {
        if (createErr.code === "auth/email-already-in-use") {
          // Scenario A: This email exists but sign-in failed.
          // Either wrong password, or a Google-only account with no password set.
          // Since Firebase merges providers, if signIn failed AND create got
          // email-already-in-use, the password was simply wrong.
          return {
            success: false,
            message:
              "Incorrect password. If you signed up with Google, please use 'Continue with Google' instead.",
          };
        }
        const messages: Record<string, string> = {
          "auth/weak-password": "Password must be at least 6 characters.",
          "auth/invalid-email": "Please enter a valid email address.",
        };
        return {
          success: false,
          message:
            messages[createErr.code] ??
            createErr.message ??
            "Authentication failed.",
        };
      }
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message ?? "Authentication failed. Please try again.",
    };
  }
}

export async function signInWithGoogle(): Promise<AuthResult> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  try {
    const cred = await signInWithPopup(auth, provider);
    const onboarding = await callGatewayLogin(cred.user);
    return {
      success: true,
      user: cred.user,
      isNew: onboarding.isNew,
      onboarding,
    };
  } catch (err: any) {
    if (err.code === "auth/popup-blocked") {
      await signInWithRedirect(auth, provider);
      // Redirect flow completes on a different page load — no onboarding
      // data is available here; the dashboard layout's fallback redirect
      // (based on a real profile fetch) handles routing in that case.
      return {
        success: true,
        user: auth.currentUser!,
        isNew: false,
        onboarding: {
          isNew: false,
          skillLevel: "",
          entranceTestStatus: "",
          entranceTestRound: 0,
        },
      };
    }
    if (err.code === "auth/popup-closed-by-user") {
      return { success: false, message: "" };
    }
    if (err.code === "auth/account-exists-with-different-credential") {
      return {
        success: false,
        message:
          "You previously signed up with email and password. Please sign in using those credentials.",
      };
    }
    return {
      success: false,
      message: err.message ?? "Google sign-in failed. Please try again.",
    };
  }
}

export async function sendPasswordReset(
  email: string,
): Promise<{ success: boolean; message: string }> {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/login`,
    });
    return { success: true, message: `Reset link sent to ${email}` };
  } catch {
    return {
      success: false,
      message: "Could not send reset email. Please try again.",
    };
  }
}

export async function resendVerification(): Promise<{
  success: boolean;
  message: string;
}> {
  const user = auth.currentUser;
  if (!user)
    return { success: false, message: "No session found. Please start over." };

  const COOLDOWN = 60_000;
  const lastSent = sessionStorage.getItem("lastVerifSent");
  if (lastSent && Date.now() - Number(lastSent) < COOLDOWN) {
    const wait = Math.ceil((COOLDOWN - (Date.now() - Number(lastSent))) / 1000);
    return {
      success: false,
      message: `Please wait ${wait}s before resending.`,
    };
  }

  try {
    await sendEmailVerification(user, {
      url: `${window.location.origin}/login`,
      handleCodeInApp: false,
    });
    sessionStorage.setItem("lastVerifSent", String(Date.now()));
    return { success: true, message: "Verification link sent!" };
  } catch {
    return { success: false, message: "Could not resend. Please try again." };
  }
}

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}
