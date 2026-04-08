import * as grpc from "@grpc/grpc-js";
import {
  UserServiceServer,
  HealthCheckRequest,
  HealthCheckResponse,
  LoginUserRequest,
  LoginUserResponse,
  GetUserProfileRequest,
  GetUserProfileResponse,
  UpdateUserPreferencesRequest,
  UpdateUserPreferencesResponse,
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

  getUserProfile: async (
    call: grpc.ServerUnaryCall<GetUserProfileRequest, GetUserProfileResponse>,
    callback: grpc.sendUnaryData<GetUserProfileResponse>,
  ) => {
    try {
      const { email } = call.request;
      const user = await userService.getUserProfile(email);

      const isNew =
        !user.skillLevel ||
        !user.learningModes ||
        user.learningModes.length === 0 ||
        !user.hoursPerWeek;

      callback(null, {
        uid: user.uid,
        email: user.email,
        name: user.name ?? "",
        skillLevel: user.skillLevel ?? "",
        learningModes: user.learningModes ?? [],
        hoursPerWeek: user.hoursPerWeek ?? 0,
        isNew,
      });
    } catch (error: any) {
      console.error("Failed to get user profile:", error.message);
      callback(
        {
          code: error.message.includes("not found")
            ? grpc.status.NOT_FOUND
            : grpc.status.INTERNAL,
          message: error.message,
        },
        null,
      );
    }
  },

  updateUserPreferences: async (
    call: grpc.ServerUnaryCall<
      UpdateUserPreferencesRequest,
      UpdateUserPreferencesResponse
    >,
    callback: grpc.sendUnaryData<UpdateUserPreferencesResponse>,
  ) => {
    try {
      const { email, skillLevel, learningModes, hoursPerWeek } = call.request;
      await userService.updateUserPreferences(
        email,
        skillLevel,
        learningModes,
        hoursPerWeek,
      );
      callback(null, { success: true });
    } catch (error: any) {
      console.error("Failed to update user preferences:", error.message);
      callback(
        {
          code: error.message.includes("required")
            ? grpc.status.INVALID_ARGUMENT
            : grpc.status.INTERNAL,
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
