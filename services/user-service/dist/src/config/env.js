"use strict";
// /src/config/env.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    PORT: process.env.PORT || 3000,
    // The address of your Go/Node User Service
    USER_SERVICE_URL: process.env.USER_SERVICE_URL || "localhost:50051",
};
