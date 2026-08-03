// ─── gRPC clients into user-service ───────────────────────────────────────────
// ai-service owns no data of its own — it assembles context per-request by
// calling the services that actually own it, rather than importing their
// handlers or reading their tables directly.

import * as grpc from "@grpc/grpc-js";
import { UserServiceClient } from "../generated/user";
import { FileServiceClient } from "../generated/file";

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "localhost:50051";

const userClient = new UserServiceClient(
  USER_SERVICE_URL,
  grpc.credentials.createInsecure(),
);
// FileService is hosted on the same user-service process as UserService.
const fileClient = new FileServiceClient(
  USER_SERVICE_URL,
  grpc.credentials.createInsecure(),
);

export function getUserProfile(email: string) {
  return new Promise<{ name: string; skillLevel: string } | null>(
    (resolve) => {
      userClient.getUserProfile({ email }, (err, res) => {
        if (err || !res) {
          resolve(null);
          return;
        }
        resolve({ name: res.name, skillLevel: res.skillLevel });
      });
    },
  );
}

export function getFileContent(
  projectId: string,
  userEmail: string,
  filePath: string,
) {
  return new Promise<string | null>((resolve) => {
    if (!filePath) {
      resolve(null);
      return;
    }
    fileClient.getFile({ projectId, userEmail, filePath }, (err, res) => {
      if (err || !res?.file) {
        resolve(null);
        return;
      }
      resolve(res.file.content);
    });
  });
}

/** Paths only — callers that need contents should follow up with getFileContent. */
export function listProjectFilePaths(projectId: string, userEmail: string) {
  return new Promise<string[]>((resolve) => {
    fileClient.listFiles({ projectId, userEmail }, (err, res) => {
      if (err || !res?.files) {
        resolve([]);
        return;
      }
      resolve(
        res.files.filter((f) => !f.isDirectory).map((f) => f.filePath),
      );
    });
  });
}

/** Paths + contents from a phase's frozen, read-only snapshot rather than
 * the live tree — used when the user is viewing project history so the
 * assistant discusses what was actually submitted, not what's since changed. */
function getSnapshotFiles(
  projectId: string,
  userEmail: string,
  phaseNumber: number,
) {
  return new Promise<{ filePath: string; content: string }[]>((resolve) => {
    fileClient.getPhaseSnapshot(
      { projectId, userEmail, phaseNumber },
      (err, res) => {
        if (err || !res?.files) {
          resolve([]);
          return;
        }
        resolve(
          res.files
            .filter((f) => !f.isDirectory)
            .map((f) => ({ filePath: f.filePath, content: f.content })),
        );
      },
    );
  });
}

export async function getSnapshotFilePaths(
  projectId: string,
  userEmail: string,
  phaseNumber: number,
) {
  return (await getSnapshotFiles(projectId, userEmail, phaseNumber)).map(
    (f) => f.filePath,
  );
}

export async function getSnapshotFileContent(
  projectId: string,
  userEmail: string,
  phaseNumber: number,
  filePath: string,
) {
  const files = await getSnapshotFiles(projectId, userEmail, phaseNumber);
  return files.find((f) => f.filePath === filePath)?.content ?? null;
}

/** Paths + contents, for building the import graph. */
export function listProjectFilesWithContent(
  projectId: string,
  userEmail: string,
) {
  return new Promise<{ filePath: string; content: string }[]>((resolve) => {
    fileClient.listFiles({ projectId, userEmail }, (err, res) => {
      if (err || !res?.files) {
        resolve([]);
        return;
      }
      resolve(
        res.files
          .filter((f) => !f.isDirectory)
          .map((f) => ({ filePath: f.filePath, content: f.content })),
      );
    });
  });
}
