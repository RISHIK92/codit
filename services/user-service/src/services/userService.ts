import * as userRepo from "../repositories/userRepo";

export const syncUser = async (uid: string, email: string, name: string) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await userRepo.upsertUser(uid, email, name);
  return user;
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
