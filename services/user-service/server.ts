import "./src/config/loadEnv";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ReflectionService } from "@grpc/reflection";
import path from "path";
import { UserServiceService } from "./src/generated/user";
import { userHandler } from "./src/handlers/userHandler";
import { UserProjectServiceService } from "./src/generated/userProject";
import { projectHandler } from "./src/handlers/projectHandler";
import { ProjectServiceService } from "./src/generated/project";
import { projectCatalogueHandler } from "./src/handlers/projectCatalogueHandler";
import { EntranceTestServiceService } from "./src/generated/entranceTest";
import { entranceTestHandler } from "./src/handlers/entranceTestHandler";
import { FileServiceService } from "./src/generated/file";
import { fileHandler } from "./src/handlers/fileHandler";
import { resourceProgressHandler } from "./src/handlers/resourceProgressHandler";
import { ResourceProgressServiceService } from "./src/generated/resourceProgress";
import { knowledgeCheckHandler } from "./src/handlers/knowledgeCheckHandler";
import { KnowledgeCheckServiceService } from "./src/generated/knowledgeCheck";
import { createLogger } from "../shared/src/index";

const logger = createLogger("user-service");

const startServer = () => {
  const server = new grpc.Server();

  server.addService(UserServiceService, userHandler);
  server.addService(UserProjectServiceService, projectHandler);
  server.addService(ProjectServiceService, projectCatalogueHandler);
  server.addService(EntranceTestServiceService, entranceTestHandler);
  server.addService(FileServiceService, fileHandler);
  server.addService(ResourceProgressServiceService, resourceProgressHandler);
  server.addService(KnowledgeCheckServiceService, knowledgeCheckHandler);

  // Reflection Configuration
  // Anchored on cwd (always this service's own directory, via npm scripts),
  // not __dirname — __dirname differs by one level between the compiled
  // dist/<service>/server.js and running server.ts directly (ts-node-dev).
  const PROTO_PATH = path.join(
    process.cwd(),
    "../../shared/proto/user.proto",
  );
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const reflection = new ReflectionService(packageDefinition);
  reflection.addToServer(server);

  const PORT = process.env.PORT || "50051";
  const URI = `0.0.0.0:${PORT}`;

  server.bindAsync(
    URI,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        logger.error({ err: error.message }, "Failed to bind server");
        return;
      }
      logger.info({ uri: URI }, "User Service running via gRPC");
    },
  );
};

startServer();
