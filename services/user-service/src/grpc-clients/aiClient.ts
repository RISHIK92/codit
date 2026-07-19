import * as grpc from "@grpc/grpc-js";
import { AiServiceClient } from "../generated/ai";

// Points to the internal network address of the AI Service microservice
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "localhost:50053";

export const aiClient = new AiServiceClient(
  AI_SERVICE_URL,
  grpc.credentials.createInsecure(),
);
