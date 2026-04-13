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
import { ResourceProgressServiceService } from "./src/generated/resourceProgress";
import { resourceProgressHandler } from "./src/handlers/resourceProgressHandler";

const startServer = () => {
  const server = new grpc.Server();

  server.addService(UserServiceService, userHandler);
  server.addService(UserProjectServiceService, projectHandler);
  server.addService(ProjectServiceService, projectCatalogueHandler);
  server.addService(EntranceTestServiceService, entranceTestHandler);
  server.addService(FileServiceService, fileHandler);
  server.addService(ResourceProgressServiceService, resourceProgressHandler);

  // Reflection Configuration
  const PROTO_PATH = path.join(__dirname, "../../../shared/proto/user.proto");
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
        console.error(`Failed to bind server: ${error.message}`);
        return;
      }
      console.log(`Node.js User Service running via gRPC on ${URI}`);
    },
  );
};

startServer();
