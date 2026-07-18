import * as grpc from "@grpc/grpc-js";
import {
  KnowledgeCheckServiceServer,
  GetPhaseKnowledgeChecksRequest,
  GetPhaseKnowledgeChecksResponse,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  GetQuizAveragesRequest,
  GetQuizAveragesResponse,
} from "../generated/knowledgeCheck";
import * as service from "../services/knowledgeCheckService";

export const knowledgeCheckHandler: KnowledgeCheckServiceServer = {
  // ── GetPhaseKnowledgeChecks ──────────────────────────────────────────────
  getPhaseKnowledgeChecks: async (
    call: grpc.ServerUnaryCall<
      GetPhaseKnowledgeChecksRequest,
      GetPhaseKnowledgeChecksResponse
    >,
    callback: grpc.sendUnaryData<GetPhaseKnowledgeChecksResponse>,
  ) => {
    try {
      const { phaseId, userEmail } = call.request;
      const rows = await service.getPhaseKnowledgeChecks(phaseId, userEmail);
      callback(null, {
        checks: rows.map((c) => ({
          id: c.id,
          phaseId: c.phase_id,
          question: c.question,
          options: c.options,
          questionType: c.question_type,
          attempted: c.attempt !== null,
          isCorrect: c.attempt?.is_correct ?? false,
          // correct_answer intentionally never sent to the client
          explanation: c.attempt ? c.explanation : "",
          submittedAnswer: c.attempt?.answer ?? "",
        })),
      });
    } catch (err: any) {
      callback({ code: grpc.status.INTERNAL, message: err.message }, null);
    }
  },

  // ── SubmitAnswer ─────────────────────────────────────────────────────────
  submitAnswer: async (
    call: grpc.ServerUnaryCall<SubmitAnswerRequest, SubmitAnswerResponse>,
    callback: grpc.sendUnaryData<SubmitAnswerResponse>,
  ) => {
    try {
      const { knowledgeCheckId, userEmail, projectId, answer } = call.request;
      const result = await service.submitAnswer(
        knowledgeCheckId,
        userEmail,
        projectId,
        answer,
      );
      callback(null, {
        isCorrect: result.isCorrect,
        explanation: result.explanation,
      });
    } catch (err: any) {
      const code =
        err.message === "Knowledge check not found"
          ? grpc.status.NOT_FOUND
          : grpc.status.INTERNAL;
      callback({ code, message: err.message }, null);
    }
  },

  // ── GetQuizAverages ──────────────────────────────────────────────────────
  getQuizAverages: async (
    call: grpc.ServerUnaryCall<GetQuizAveragesRequest, GetQuizAveragesResponse>,
    callback: grpc.sendUnaryData<GetQuizAveragesResponse>,
  ) => {
    try {
      const { userEmail } = call.request;
      const averages = await service.getQuizAverages(userEmail);
      callback(null, { averages });
    } catch (err: any) {
      callback({ code: grpc.status.INTERNAL, message: err.message }, null);
    }
  },
};
