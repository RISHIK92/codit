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
  SetUserProjectArchivedRequest,
  SetUserProjectArchivedResponse,
  SubmitPhaseReviewRequest,
  SubmitPhaseReviewResponse,
} from "../generated/userProject";
import * as projectService from "../services/projectService";
import * as phaseReviewService from "../services/phaseReviewService";
import { Status } from "../db/prismaClient";

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
      } else if (error.message.includes("already have a live project")) {
        statusCode = grpc.status.FAILED_PRECONDITION;
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
              archived: dbProject.archived ?? false,
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
        userProjects: dbProjects.map((p: any) => ({
          projectId: p.project_id,
          email: p.user_email,
          status: p.status,
          currentPhase: p.current_phase,
          archived: p.archived ?? false,
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
        userProjects: dbProjects.map((p: any) => ({
          projectId: p.project_id,
          email: p.user_email,
          status: p.status,
          currentPhase: p.current_phase,
          archived: p.archived ?? false,
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
  setUserProjectArchived: async (
    call: grpc.ServerUnaryCall<
      SetUserProjectArchivedRequest,
      SetUserProjectArchivedResponse
    >,
    callback: grpc.sendUnaryData<SetUserProjectArchivedResponse>,
  ) => {
    try {
      const { projectId, email, archived } = call.request;

      console.log(
        `Received gRPC request to set archived=${archived} for project: ${projectId}`,
      );

      const updated = await projectService.setUserProjectArchived(
        projectId,
        email,
        archived,
      );

      callback(null, {
        userProject: {
          projectId: updated.project_id,
          email: updated.user_email,
          status: updated.status,
          currentPhase: updated.current_phase,
          archived: updated.archived ?? false,
        },
      });
    } catch (error: any) {
      console.error("Failed to set project archived state:", error.message);

      let statusCode = grpc.status.INTERNAL;
      if (error.message.includes("required")) {
        statusCode = grpc.status.INVALID_ARGUMENT;
      } else if (
        error.message.includes("already have an archived project") ||
        error.message.includes("already have a live project")
      ) {
        statusCode = grpc.status.FAILED_PRECONDITION;
      } else if (error.code === "P2025") {
        // Prisma "record not found" on the update.
        statusCode = grpc.status.NOT_FOUND;
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
  submitPhaseReview: async (
    call: grpc.ServerUnaryCall<
      SubmitPhaseReviewRequest,
      SubmitPhaseReviewResponse
    >,
    callback: grpc.sendUnaryData<SubmitPhaseReviewResponse>,
  ) => {
    try {
      const { projectId, email, activeFilePath } = call.request;

      console.log(
        `Received gRPC request to review phase submission for project: ${projectId}`,
      );

      const result = await phaseReviewService.submitPhaseReview(
        projectId,
        email,
        activeFilePath ?? "",
      );

      console.log(
        `Phase review for ${projectId} (${email}): ${result.verdict}` +
          `${result.advanced ? ` — advanced to phase ${result.currentPhase}` : ""}`,
      );

      callback(null, {
        verdict: result.verdict,
        advanced: result.advanced,
        feedback: result.feedback,
        currentPhase: result.currentPhase,
        checksTotal: result.checksTotal,
        checksCorrect: result.checksCorrect,
      });
    } catch (error: any) {
      console.error("Failed to review phase submission:", error.message);

      let statusCode = grpc.status.INTERNAL;
      if (error.code === "P2025") {
        statusCode = grpc.status.NOT_FOUND;
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
};
