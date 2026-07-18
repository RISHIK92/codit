import * as userRepo from "../repositories/userRepo";
import * as entranceTestRepo from "../repositories/entranceTestRepo";

export const syncUser = async (uid: string, email: string, name: string) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await userRepo.upsertUser(uid, email, name);
  return user;
};

export const isProfileNew = (user: {
  skillLevel: string | null;
  learningModes: string[];
  hoursPerWeek: number | null;
}) =>
  !user.skillLevel ||
  !user.learningModes ||
  user.learningModes.length === 0 ||
  !user.hoursPerWeek;

/**
 * Onboarding status for a user, combining profile completeness with the
 * entrance-test attempt state. Used by LoginUser so the client can route
 * straight to /onboarding or /dashboard without a separate profile fetch.
 */
export const getOnboardingStatus = async (email: string) => {
  const [user, attempt] = await Promise.all([
    userRepo.findUserByEmail(email),
    entranceTestRepo.getAttempt(email),
  ]);
  if (!user) throw new Error("User not found");

  return {
    isNew: isProfileNew(user),
    skillLevel: user.skillLevel ?? "",
    entranceTestStatus: attempt?.status ?? "",
    entranceTestRound: attempt?.round ?? 0,
  };
};

export const getUserProfile = async (email: string) => {
  if (!email) throw new Error("Email is required");
  const user = await userRepo.findUserByEmail(email);
  if (!user) throw new Error("User not found");
  return user;
};

export const updateUserPreferences = async (
  email: string,
  skillLevel: string,
  learningModes: string[],
  hoursPerWeek: number,
) => {
  if (!email) throw new Error("Email is required");
  if (!skillLevel) throw new Error("skill_level is required");
  if (!learningModes || learningModes.length === 0)
    throw new Error("learning_modes is required");
  if (!hoursPerWeek || hoursPerWeek <= 0)
    throw new Error("hours_per_week is required");

  return await userRepo.updateUserPreferences(
    email,
    skillLevel,
    learningModes,
    hoursPerWeek,
  );
};
