import * as grpc from "@grpc/grpc-js";
import {
  FileServiceServer,
  UpsertFileRequest,
  UpsertFileResponse,
  GetFileRequest,
  GetFileResponse,
  ListFilesRequest,
  ListFilesResponse,
  DeleteFileRequest,
  DeleteFileResponse,
  BatchUpsertRequest,
  BatchUpsertResponse,
} from "../generated/file";
import * as fileService from "../services/fileService";

/** Serialize a Prisma ProjectFile row into the proto ProjectFile message shape. */
function toProto(row: {
  id: string;
  project_id: string;
  user_email: string;
  file_path: string;
  content: string;
  is_directory: boolean;
  created_at: Date;
  updated_at: Date;
}) {
  return {
    id: row.id,
    projectId: row.project_id,
    userEmail: row.user_email,
    filePath: row.file_path,
    content: row.content,
    isDirectory: row.is_directory,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export const fileHandler: FileServiceServer = {
  // ── UpsertFile ──────────────────────────────────────────────────────────────
  upsertFile: async (
    call: grpc.ServerUnaryCall<UpsertFileRequest, UpsertFileResponse>,
    callback: grpc.sendUnaryData<UpsertFileResponse>,
  ) => {
    try {
      const { projectId, userEmail, filePath, content, isDirectory } =
        call.request;
      const row = await fileService.upsertFile(
        projectId,
        userEmail,
        filePath,
        content,
        isDirectory,
      );
      callback(null, { file: toProto(row) });
    } catch (err: any) {
      callback({ code: grpc.status.INTERNAL, message: err.message }, null);
    }
  },

  // ── GetFile ─────────────────────────────────────────────────────────────────
  getFile: async (
    call: grpc.ServerUnaryCall<GetFileRequest, GetFileResponse>,
    callback: grpc.sendUnaryData<GetFileResponse>,
  ) => {
    try {
      const { projectId, userEmail, filePath } = call.request;
      const row = await fileService.getFile(projectId, userEmail, filePath);
      if (!row) {
        return callback(
          { code: grpc.status.NOT_FOUND, message: "File not found" },
          null,
        );
      }
      callback(null, { file: toProto(row) });
    } catch (err: any) {
      callback({ code: grpc.status.INTERNAL, message: err.message }, null);
    }
  },

  // ── ListFiles ───────────────────────────────────────────────────────────────
  listFiles: async (
    call: grpc.ServerUnaryCall<ListFilesRequest, ListFilesResponse>,
    callback: grpc.sendUnaryData<ListFilesResponse>,
  ) => {
    try {
      const { projectId, userEmail } = call.request;
      const rows = await fileService.listFiles(projectId, userEmail);
      callback(null, { files: rows.map(toProto) });
    } catch (err: any) {
      callback({ code: grpc.status.INTERNAL, message: err.message }, null);
    }
  },

  // ── DeleteFile ──────────────────────────────────────────────────────────────
  deleteFile: async (
    call: grpc.ServerUnaryCall<DeleteFileRequest, DeleteFileResponse>,
    callback: grpc.sendUnaryData<DeleteFileResponse>,
  ) => {
    try {
      const { projectId, userEmail, filePath } = call.request;
      await fileService.deleteFile(projectId, userEmail, filePath);
      callback(null, { success: true });
    } catch (err: any) {
      callback({ code: grpc.status.INTERNAL, message: err.message }, null);
    }
  },

  // ── BatchUpsert ─────────────────────────────────────────────────────────────
  batchUpsert: async (
    call: grpc.ServerUnaryCall<BatchUpsertRequest, BatchUpsertResponse>,
    callback: grpc.sendUnaryData<BatchUpsertResponse>,
  ) => {
    try {
      const { projectId, userEmail, entries } = call.request;
      const mapped = entries.map((e) => ({
        filePath: e.filePath,
        content: e.content,
        isDirectory: e.isDirectory,
      }));
      const count = await fileService.batchUpsert(projectId, userEmail, mapped);
      callback(null, { upsertedCount: count });
    } catch (err: any) {
      callback({ code: grpc.status.INTERNAL, message: err.message }, null);
    }
  },
};
