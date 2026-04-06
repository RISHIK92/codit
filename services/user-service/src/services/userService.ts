import * as userRepo from "../repositories/userRepo";
import bcrypt from "bcrypt";

export const registerUser = async (uid: string, email: string) => {
  // 1. Basic validation (Gateway should also do this, but always protect your backend)
  if (!email || !uid) {
    throw new Error("Email and UID are required");
  }

  // 2. Check if user already exists
  const existingUser = await userRepo.findUserByUid(uid);
  if (existingUser) {
    throw new Error("User already exists");
  }

  // 4. Save to database
  const newUser = await userRepo.createUserInDb(uid, email);

  return newUser;
};
