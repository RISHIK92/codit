import * as grpc from "@grpc/grpc-js";
import {
  UserProjectServiceServer,
  CreateUserProjectRequest,
  CreateUserProjectResponse,
  HealthCheckRequest,
  HealthCheckResponse,
} from "../generated/userProject";
import * as projectService from "../services/projectService";
import { Status } from "@prisma/client";

export const projectHandler: UserProjectServiceServer = {
  createProject: async (
    call: grpc.ServerUnaryCall<
      CreateUserProjectRequest,
      CreateUserProjectResponse
    >,
    callback: grpc.sendUnaryData<CreateUserProjectResponse>,
  ) => {
    try {
      const { projectId, email, status, currentPhase } = call.request;

      console.log(`Received gRPC request to create project: ${projectId}`);

      await projectService.createProject(
        projectId,
        email,
        status as Status,
        currentPhase,
      );

      callback(null, {
        success: true,
      });
    } catch (error: any) {
      console.error("Failed to create project:", error.message);

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
