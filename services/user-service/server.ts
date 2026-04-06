import * as grpc from "@grpc/grpc-js";
import { UserServiceService } from "./src/generated/user";
import { userHandler } from "./src/handlers/userHandler";

const startServer = () => {
  const server = new grpc.Server();

  server.addService(UserServiceService, userHandler);

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
