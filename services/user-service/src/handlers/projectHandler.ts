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
  GetGrowthRequest,
  GetGrowthResponse,
  StartCheckpointRequest,
  StartCheckpointResponse,
  SubmitCheckpointRequest,
  SubmitCheckpointResponse,
  ShareArtifactRequest,
  ShareArtifactResponse,
  RevokeArtifactRequest,
  RevokeArtifactResponse,
  ListMyArtifactsRequest,
  ListMyArtifactsResponse,
  GetPublicArtifactRequest,
  GetPublicArtifactResponse,
} from "../generated/userProject";
import * as shareService from "../services/shareService";
import * as growthService from "../services/growthService";
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
        criteriaTotal: result.criteriaTotal,
        criteriaPassed: result.criteriaPassed,
        results: result.results.map((r) => ({
          criterionId: r.criterionId,
          text: r.text,
          kind: r.kind,
          passed: r.passed,
          reasoning: r.reasoning,
          evidencePath: r.evidencePath,
          evidenceLines: r.evidenceLines,
          // The hint is the nudge toward the concept — only useful, and only
          // sent, once the check has actually failed.
          hint: r.passed ? "" : r.hint,
          ungraded: r.ungraded,
        })),
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

  getGrowth: async (
    call: grpc.ServerUnaryCall<GetGrowthRequest, GetGrowthResponse>,
    callback: grpc.sendUnaryData<GetGrowthResponse>,
  ) => {
    try {
      const { stats, fog, era, unexplained } = await growthService.getGrowth(
        call.request.email,
      );
      callback(null, {
        build: stats.build,
        understand: stats.understand,
        explore: stats.explore,
        show: stats.show,
        eraName: era.current.name,
        eraBlurb: era.current.blurb,
        eraIndex: era.current.index,
        nextEraName: era.next?.name ?? "",
        nextRequirements: era.nextRequirements.map((r) => ({
          label: r.label,
          met: r.met,
          have: r.have,
          need: r.need,
        })),
        fogCount: fog.count,
        unexplained: unexplained.map((u) => ({
          projectId: u.projectId,
          projectName: u.projectName,
          phaseNumber: u.phaseNumber,
        })),
      });
    } catch (error: any) {
      console.error("GetGrowth failed:", error.message);
      callback({ code: grpc.status.INTERNAL, message: error.message }, null);
    }
  },

  startCheckpoint: async (
    call: grpc.ServerUnaryCall<StartCheckpointRequest, StartCheckpointResponse>,
    callback: grpc.sendUnaryData<StartCheckpointResponse>,
  ) => {
    try {
      const { email, projectId, phaseNumber } = call.request;
      const r = await growthService.startCheckpoint(email, projectId, phaseNumber);
      callback(null, { checkpointId: r.checkpointId, question: r.question });
    } catch (error: any) {
      console.error("StartCheckpoint failed:", error.message);
      callback({ code: grpc.status.INTERNAL, message: error.message }, null);
    }
  },

  submitCheckpoint: async (
    call: grpc.ServerUnaryCall<SubmitCheckpointRequest, SubmitCheckpointResponse>,
    callback: grpc.sendUnaryData<SubmitCheckpointResponse>,
  ) => {
    try {
      const { email, checkpointId, answer } = call.request;
      const r = await growthService.submitCheckpoint(email, checkpointId, answer);
      callback(null, {
        passed: r.passed,
        feedback: r.feedback,
        missingConcepts: r.missingConcepts,
      });
    } catch (error: any) {
      console.error("SubmitCheckpoint failed:", error.message);
      callback({ code: grpc.status.INTERNAL, message: error.message }, null);
    }
  },

  shareArtifact: async (
    call: grpc.ServerUnaryCall<ShareArtifactRequest, ShareArtifactResponse>,
    callback: grpc.sendUnaryData<ShareArtifactResponse>,
  ) => {
    try {
      const { email, projectId, phaseNumber, includeCode } = call.request;
      const r = await shareService.shareArtifact(email, projectId, phaseNumber, includeCode);
      callback(null, { slug: r.slug });
    } catch (error: any) {
      console.error("ShareArtifact failed:", error.message);
      callback({ code: grpc.status.INTERNAL, message: error.message }, null);
    }
  },

  revokeArtifact: async (
    call: grpc.ServerUnaryCall<RevokeArtifactRequest, RevokeArtifactResponse>,
    callback: grpc.sendUnaryData<RevokeArtifactResponse>,
  ) => {
    try {
      const r = await shareService.revokeArtifact(call.request.email, call.request.slug);
      callback(null, { revoked: r.revoked });
    } catch (error: any) {
      console.error("RevokeArtifact failed:", error.message);
      callback({ code: grpc.status.INTERNAL, message: error.message }, null);
    }
  },

  listMyArtifacts: async (
    call: grpc.ServerUnaryCall<ListMyArtifactsRequest, ListMyArtifactsResponse>,
    callback: grpc.sendUnaryData<ListMyArtifactsResponse>,
  ) => {
    try {
      const r = await shareService.listMyArtifacts(call.request.email);
      callback(null, {
        shared: r.shared.map((a) => ({
          slug: a.slug,
          projectId: a.projectId,
          projectName: a.projectName,
          phaseNumber: a.phaseNumber,
          phaseTitle: a.phaseTitle,
          includeCode: a.includeCode,
          viewCount: a.viewCount,
        })),
        shareable: r.shareable.map((a) => ({
          projectId: a.projectId,
          projectName: a.projectName,
          phaseNumber: a.phaseNumber,
          phaseTitle: a.phaseTitle,
        })),
        profileUnlocked: r.profileUnlocked,
        profileLockedReason: r.profileLockedReason,
      });
    } catch (error: any) {
      console.error("ListMyArtifacts failed:", error.message);
      callback({ code: grpc.status.INTERNAL, message: error.message }, null);
    }
  },

  getPublicArtifact: async (
    call: grpc.ServerUnaryCall<GetPublicArtifactRequest, GetPublicArtifactResponse>,
    callback: grpc.sendUnaryData<GetPublicArtifactResponse>,
  ) => {
    try {
      const a: any = await shareService.getPublicArtifact(call.request.slug);
      callback(null, {
        found: a.found,
        revoked: a.revoked,
        authorName: a.authorName ?? "",
        projectName: a.projectName ?? "",
        phaseNumber: a.phaseNumber ?? 0,
        phaseTitle: a.phaseTitle ?? "",
        createdAt: a.createdAt ?? "",
        criteria: (a.criteria ?? []).map((c: any) => ({
          text: c.text,
          kind: c.kind,
          evidencePath: c.evidencePath,
          evidenceLines: c.evidenceLines,
        })),
        explanationQuestion: a.explanationQuestion ?? "",
        explanationAnswer: a.explanationAnswer ?? "",
        files: (a.files ?? []).map((f: any) => ({ path: f.path, content: f.content })),
      });
    } catch (error: any) {
      console.error("GetPublicArtifact failed:", error.message);
      callback({ code: grpc.status.INTERNAL, message: error.message }, null);
    }
  },
};
