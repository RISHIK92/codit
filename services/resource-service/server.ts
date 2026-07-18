import "./src/config/loadEnv";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ReflectionService } from "@grpc/reflection";
import path from "path";
import { ResourceProgressServiceService } from "./src/generated/resourceProgress";
import { resourceProgressHandler } from "../user-service/src/handlers/resourceProgressHandler";
import { createLogger } from "../shared/src/index";

const logger = createLogger("resource-service");

const startServer = () => {
  const server = new grpc.Server();

  server.addService(ResourceProgressServiceService, resourceProgressHandler);

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

  const PORT = process.env.PORT || "50052";
  const URI = `0.0.0.0:${PORT}`;

  server.bindAsync(
    URI,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        logger.error({ err: error.message }, "Failed to bind server");
        return;
      }
      logger.info({ uri: URI }, "Resource Service running via gRPC");
    },
  );
};

startServer();
