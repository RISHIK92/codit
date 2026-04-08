"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertUser = exports.findUserByUid = exports.createUserInDb = void 0;
const prismaClient_1 = __importDefault(require("../db/prismaClient"));
const createUserInDb = (uid, email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.default.user.create({
        data: {
            uid,
            email,
        },
    });
});
exports.createUserInDb = createUserInDb;
const findUserByUid = (uid) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.default.user.findUnique({
        where: { uid },
    });
});
exports.findUserByUid = findUserByUid;
const upsertUser = (uid, email, name) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.default.user.upsert({
        where: {
            uid,
        },
        update: {
            name: name || undefined,
        },
        create: {
            uid: uid,
            email: email,
            name: name || "Anonymous User",
        },
    });
});
exports.upsertUser = upsertUser;
