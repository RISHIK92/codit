import * as grpc from "@grpc/grpc-js";
import {
  ResourceProgressServiceServer,
  GetPhaseResourcesRequest,
  GetPhaseResourcesResponse,
  MarkCompletedRequest,
  MarkCompletedResponse,
  GetProgressRequest,
  GetProgressResponse,
} from "../generated/resourceProgress";
import * as service from "../services/resourceProgressService";

export const resourceProgressHandler: ResourceProgressServiceServer = {
  // ── GetPhaseResources ──────────────────────────────────────────────────────
  getPhaseResources: async (
    call: grpc.ServerUnaryCall<
      GetPhaseResourcesRequest,
      GetPhaseResourcesResponse
    >,
    callback: grpc.sendUnaryData<GetPhaseResourcesResponse>,
  ) => {
    try {
      const { phaseId, userEmail, projectId } = call.request;
      const rows = await service.getPhaseResources(
        phaseId,
        userEmail,
        projectId,
      );
      callback(null, {
        resources: rows.map((r) => ({
          id: r.id,
          phaseId: r.phase_id,
          type: r.type,
          title: r.title,
          url: r.url,
          durationMinutes: r.duration_minutes,
          provider: r.provider,
          qualityScore: r.quality_score,
          completed: r.completed,
          completedAt: r.completed_at?.toISOString() ?? "",
        })),
      });
    } catch (err: any) {
      callback({ code: grpc.status.INTERNAL, message: err.message }, null);
    }
  },

  // ── MarkCompleted ──────────────────────────────────────────────────────────
  markCompleted: async (
    call: grpc.ServerUnaryCall<MarkCompletedRequest, MarkCompletedResponse>,
    callback: grpc.sendUnaryData<MarkCompletedResponse>,
  ) => {
    try {
      const { resourceId, userEmail, projectId, completed } = call.request;
      await service.markCompleted(resourceId, userEmail, projectId, completed);
      callback(null, { success: true });
    } catch (err: any) {
      callback({ code: grpc.status.INTERNAL, message: err.message }, null);
    }
  },

  // ── GetProgress ────────────────────────────────────────────────────────────
  getProgress: async (
    call: grpc.ServerUnaryCall<GetProgressRequest, GetProgressResponse>,
    callback: grpc.sendUnaryData<GetProgressResponse>,
  ) => {
    try {
      const { userEmail, projectId } = call.request;
      const rows = await service.getProgress(userEmail, projectId);
      callback(null, {
        entries: rows.map((r) => ({
          resourceId: r.resource_id,
          completed: r.completed,
          completedAt: r.completed_at?.toISOString() ?? "",
        })),
      });
    } catch (err: any) {
      callback({ code: grpc.status.INTERNAL, message: err.message }, null);
    }
  },
};
