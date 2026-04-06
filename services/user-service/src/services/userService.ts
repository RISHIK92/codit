import * as userRepo from "../repositories/userRepo";
import bcrypt from "bcrypt";

export const registerUser = async (
  email: string,
  plainTextPassword: string,
) => {
  // 1. Basic validation
  if (!email || !plainTextPassword) {
    throw new Error("Email and password are required");
  }

  // 2. Check if user already exists
  const existingUser = await userRepo.findUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  // 3. Hash the password (cost factor 10)
  const passwordHash = await bcrypt.hash(plainTextPassword, 10);

  // 4. Save to database
  const newUser = await userRepo.createUserInDb(email, passwordHash);

  return newUser;
};
