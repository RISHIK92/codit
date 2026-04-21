import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ReflectionService } from "@grpc/reflection";
import path from "path";
import { ResourceProgressServiceService } from "./src/generated/resourceProgress";
import { resourceProgressHandler } from "../user-service/src/handlers/resourceProgressHandler";

const startServer = () => {
  const server = new grpc.Server();

  server.addService(ResourceProgressServiceService, resourceProgressHandler);

  // Reflection Configuration
  const PROTO_PATH = path.join(
    __dirname,
    "../../../../shared/proto/user.proto",
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
        console.error(`Failed to bind server: ${error.message}`);
        return;
      }
      console.log(`Node.js User Service running via gRPC on ${URI}`);
    },
  );
};

startServer();
