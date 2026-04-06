import * as grpc from "@grpc/grpc-js";
import {
  UserServiceServer,
  CreateUserRequest,
  UserResponse,
} from "../generated/user";
import * as userService from "../services/userService";

export const userHandler: UserServiceServer = {
  createUser: async (
    call: grpc.ServerUnaryCall<CreateUserRequest, UserResponse>,
    callback: grpc.sendUnaryData<UserResponse>,
  ) => {
    try {
      const { email, password } = call.request;

      console.log(`Received gRPC request to create user: ${email}`);

      const user = await userService.registerUser(email, password);

      callback(null, {
        id: user.id,
        success: true,
      });
    } catch (error: any) {
      console.error("Failed to create user:", error.message);

      callback(
        {
          code: grpc.status.ALREADY_EXISTS,
          message: error.message,
        },
        null,
      );
    }
  },
};
