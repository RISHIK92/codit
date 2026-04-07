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
  loginUser: async (
    call: grpc.ServerUnaryCall<LoginUserRequest, LoginUserResponse>,
    callback: grpc.sendUnaryData<LoginUserResponse>,
  ) => {
    try {
      const { uid, name, email } = call.request;

      console.log(`Received gRPC request to create user: ${email}`);

      await userService.syncUser(uid, email, name);

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
  healthCheck: function (
    call: grpc.ServerUnaryCall<HealthCheckRequest, HealthCheckResponse>,
    callback: grpc.sendUnaryData<HealthCheckResponse>,
  ) {
    callback(null, {
      healthy: true,
    });
  },
};
