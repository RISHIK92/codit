import * as grpc from "@grpc/grpc-js";
import {
  UserServiceServer,
  HealthCheckRequest,
  HealthCheckResponse,
  LoginUserRequest,
  LoginUserResponse,
} from "../generated/user";
import * as userService from "../services/userService";

export const userHandler: UserServiceServer = {
  createUser: async (
    call: grpc.ServerUnaryCall<LoginUserRequest, LoginUserResponse>,
    callback: grpc.sendUnaryData<LoginUserResponse>,
  ) => {
    try {
      const { uid, email } = call.request;

      console.log(`Received gRPC request to create user: ${email}`);

      await userService.registerUser(uid, email);

      callback(null, {
        success: true,
      });
    } catch (error: any) {
      console.error("Failed to create user:", error.message);

      let statusCode = grpc.status.INTERNAL;
      if (error.message.includes("required")) {
        statusCode = grpc.status.INVALID_ARGUMENT;
      } else if (error.message.includes("exists")) {
        statusCode = grpc.status.ALREADY_EXISTS;
      }

      callback(
        {
          code: statusCode,
          message: error.message,
        },
        null,
      );
    }
  },
  loginUser: function (
    call: grpc.ServerUnaryCall<LoginUserRequest, LoginUserResponse>,
    callback: grpc.sendUnaryData<LoginUserResponse>,
  ): void {
    throw new Error("Function not implemented.");
  },
  healthCheck: function (
    call: grpc.ServerUnaryCall<HealthCheckRequest, HealthCheckResponse>,
    callback: grpc.sendUnaryData<HealthCheckResponse>,
  ): void {
    throw new Error("Function not implemented.");
  },
};
