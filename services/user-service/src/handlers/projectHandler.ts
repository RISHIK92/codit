import * as grpc from "@grpc/grpc-js";
import {
  UserProjectServiceServer,
  CreateUserProjectRequest,
  CreateUserProjectResponse,
  GetUserProjectByIdRequest,
  GetUserProjectByIdResponse,
  GetAllUserProjectsRequest,
  GetAllUserProjectsResponse,
  GetUserProjectsByStatusRequest,
  GetUserProjectsByStatusResponse,
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
  getUserProjectById: async (
    call: grpc.ServerUnaryCall<
      GetUserProjectByIdRequest,
      GetUserProjectByIdResponse
    >,
    callback: grpc.sendUnaryData<GetUserProjectByIdResponse>,
  ) => {
    try {
      const { projectId } = call.request;

      console.log(`Received gRPC request to get project: ${projectId}`);

      const dbProject = await projectService.findProjectById(projectId);

      callback(null, {
        userProject: dbProject
          ? {
              projectId: dbProject.project_id,
              email: dbProject.user_email,
              status: dbProject.status,
              currentPhase: dbProject.current_phase,
            }
          : undefined,
      });
    } catch (error: any) {
      console.error("Failed to get project:", error.message);

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
  getAllUserProjects: async (
    call: grpc.ServerUnaryCall<
      GetAllUserProjectsRequest,
      GetAllUserProjectsResponse
    >,
    callback: grpc.sendUnaryData<GetAllUserProjectsResponse>,
  ) => {
    try {
      const { email } = call.request;

      console.log(
        `Received gRPC request to get all projects for user: ${email}`,
      );

      const dbProjects = await projectService.getAllProjects(email);

      callback(null, {
        userProjects: dbProjects.map((p) => ({
          projectId: p.project_id,
          email: p.user_email,
          status: p.status,
          currentPhase: p.current_phase,
        })),
      });
    } catch (error: any) {
      console.error("Failed to get all projects:", error.message);

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
  getUserProjectsByStatus: async (
    call: grpc.ServerUnaryCall<
      GetUserProjectsByStatusRequest,
      GetUserProjectsByStatusResponse
    >,
    callback: grpc.sendUnaryData<GetUserProjectsByStatusResponse>,
  ) => {
    try {
      const { email, status } = call.request;

      console.log(
        `Received gRPC request to get projects by status "${status}" for user: ${email}`,
      );

      const dbProjects = await projectService.getProjectsByStatus(
        email,
        status as Status,
      );

      callback(null, {
        userProjects: dbProjects.map((p) => ({
          projectId: p.project_id,
          email: p.user_email,
          status: p.status,
          currentPhase: p.current_phase,
        })),
      });
    } catch (error: any) {
      console.error("Failed to get projects by status:", error.message);

      callback(
        {
          code: grpc.status.INTERNAL,
          message: error.message,
        },
        null,
      );
    }
  },
};
