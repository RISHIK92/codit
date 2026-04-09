"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const reflection_1 = require("@grpc/reflection");
const path_1 = __importDefault(require("path"));
const user_1 = require("./src/generated/user");
const userHandler_1 = require("./src/handlers/userHandler");
const userProject_1 = require("./src/generated/userProject");
const projectHandler_1 = require("./src/handlers/projectHandler");
const project_1 = require("./src/generated/project");
const projectCatalogueHandler_1 = require("./src/handlers/projectCatalogueHandler");
const entranceTest_1 = require("./src/generated/entranceTest");
const entranceTestHandler_1 = require("./src/handlers/entranceTestHandler");
const startServer = () => {
    const server = new grpc.Server();
    server.addService(user_1.UserServiceService, userHandler_1.userHandler);
    server.addService(userProject_1.UserProjectServiceService, projectHandler_1.projectHandler);
    server.addService(project_1.ProjectServiceService, projectCatalogueHandler_1.projectCatalogueHandler);
    server.addService(entranceTest_1.EntranceTestServiceService, entranceTestHandler_1.entranceTestHandler);
    // Reflection Configuration
    const PROTO_PATH = path_1.default.join(__dirname, "../../../shared/proto/user.proto");
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });
    const reflection = new reflection_1.ReflectionService(packageDefinition);
    reflection.addToServer(server);
    const PORT = process.env.PORT || "50051";
    const URI = `0.0.0.0:${PORT}`;
    server.bindAsync(URI, grpc.ServerCredentials.createInsecure(), (error, port) => {
        if (error) {
            console.error(`Failed to bind server: ${error.message}`);
            return;
        }
        console.log(`Node.js User Service running via gRPC on ${URI}`);
    });
};
startServer();
