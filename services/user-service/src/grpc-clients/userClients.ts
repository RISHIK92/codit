import * as grpc from "@grpc/grpc-js";
// Assuming you generated a UserService similar to the DataService earlier
import { UserServiceClient } from "../generated/user";

// Points to the internal network address of the User Service microservice
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "localhost:50051";

export const userClient = new UserServiceClient(
  USER_SERVICE_URL,
  grpc.credentials.createInsecure(), // Use secure credentials in production!
);
