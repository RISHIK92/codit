import * as userRepo from "../repositories/userRepo";

export const syncUser = async (uid: string, email: string, name: string) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await userRepo.upsertUser(uid, email, name);
  return user;
};
