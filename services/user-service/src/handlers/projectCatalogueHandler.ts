import * as grpc from "@grpc/grpc-js";
import {
  ProjectServiceServer,
  GetAllProjectsRequest,
  GetAllProjectsResponse,
  GetProjectByIdRequest,
  GetProjectByIdResponse,
} from "../generated/project";
import * as projectService from "../services/projectService";

export const projectCatalogueHandler: ProjectServiceServer = {
  getAllProjects: async (
    call: grpc.ServerUnaryCall<GetAllProjectsRequest, GetAllProjectsResponse>,
    callback: grpc.sendUnaryData<GetAllProjectsResponse>,
  ) => {
    try {
      console.log("Received gRPC request: GetAllProjects");

      const rows = await projectService.getAllCatalogueProjects();

      callback(null, {
        projects: rows.map((p) => ({
          id: p.id,
          name: p.name,
          techStack: p.tech_stack,
          skillLevel: p.skill_level,
          estimatedMinutes: p.estimated_minutes,
          phaseCount: p._count.learningPhases,
        })),
      });
    } catch (error: any) {
      console.error("GetAllProjects failed:", error.message);
      callback({ code: grpc.status.INTERNAL, message: error.message }, null);
    }
  },

  getProjectById: async (
    call: grpc.ServerUnaryCall<GetProjectByIdRequest, GetProjectByIdResponse>,
    callback: grpc.sendUnaryData<GetProjectByIdResponse>,
  ) => {
    try {
      const { projectId } = call.request;
      console.log(`Received gRPC request: GetProjectById (${projectId})`);

      if (!projectId) {
        callback(
          {
            code: grpc.status.INVALID_ARGUMENT,
            message: "project_id is required",
          },
          null,
        );
        return;
      }

      const p = await projectService.getCatalogueProjectById(projectId);

      callback(null, {
        project: p
          ? {
              id: p.id,
              name: p.name,
              techStack: p.tech_stack,
              skillLevel: p.skill_level,
              estimatedMinutes: p.estimated_minutes,
              phaseCount: p._count.learningPhases,
            }
          : undefined,
      });
    } catch (error: any) {
      console.error("GetProjectById failed:", error.message);
      callback({ code: grpc.status.INTERNAL, message: error.message }, null);
    }
  },
};
