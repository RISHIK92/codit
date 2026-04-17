import * as grpc from "@grpc/grpc-js";
import {
  ProjectServiceServer,
  GetAllProjectsRequest,
  GetAllProjectsResponse,
  GetProjectByIdRequest,
  GetProjectByIdResponse,
  GetProjectWithPhasesRequest,
  GetProjectWithPhasesResponse,
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
        projects: rows.map((p: any) => ({
          id: p.id,
          name: p.name,
          techStack: p.tech_stack,
          skillLevel: p.skill_level,
          estimatedMinutes: p.estimated_minutes,
          phaseCount: p._count.learningPhases,
          goal: p.goal ?? "",
          demoUrl: p.demo_url ?? "",
          deliverables: p.deliverables.map((d: any) => d.text),
          initialFiles: p.initial_files ? JSON.stringify(p.initial_files) : "",
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
              goal: p.goal ?? "",
              demoUrl: p.demo_url ?? "",
              deliverables: p.deliverables?.map((d: any) => d.text) ?? [],
              initialFiles: p.initial_files
                ? JSON.stringify(p.initial_files)
                : "",
            }
          : undefined,
      });
    } catch (error: any) {
      console.error("GetProjectById failed:", error.message);
      callback({ code: grpc.status.INTERNAL, message: error.message }, null);
    }
  },

  getProjectWithPhases: async (
    call: grpc.ServerUnaryCall<
      GetProjectWithPhasesRequest,
      GetProjectWithPhasesResponse
    >,
    callback: grpc.sendUnaryData<GetProjectWithPhasesResponse>,
  ) => {
    try {
      const { projectId } = call.request;
      console.log(`Received gRPC request: GetProjectWithPhases (${projectId})`);

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

      const p = await projectService.getProjectWithPhases(projectId);

      if (!p) {
        callback(
          { code: grpc.status.NOT_FOUND, message: "Project not found" },
          null,
        );
        return;
      }

      callback(null, {
        project: {
          id: p.id,
          name: p.name,
          techStack: p.tech_stack,
          skillLevel: p.skill_level,
          estimatedMinutes: p.estimated_minutes,
          phaseCount: p._count.learningPhases,
          goal: p.goal ?? "",
          demoUrl: p.demo_url ?? "",
          deliverables: p.deliverables?.map((d: any) => d.text) ?? [],
          initialFiles: p.initial_files ? JSON.stringify(p.initial_files) : "",
        },
        phases: p.learningPhases.map((ph: any) => ({
          id: ph.id,
          title: ph.title,
          description: ph.description,
          longDescription: ph.long_description ?? "",
          goal: ph.goal ? JSON.stringify(ph.goal) : "",
          phaseNumber: ph.phase_number,
          estimatedMinutes: ph.estimated_minutes,
        })),
        locked: false,
        alreadyStarted: false,
      });
    } catch (error: any) {
      console.error("GetProjectWithPhases failed:", error.message);
      callback({ code: grpc.status.INTERNAL, message: error.message }, null);
    }
  },
};
