import * as grpc from "@grpc/grpc-js";
import {
  EntranceTestServiceServer,
  StartTestRequest,
  StartTestResponse,
  SubmitRoundRequest,
  SubmitRoundResponse,
} from "../generated/entranceTest";
import * as entranceTestService from "../services/entranceTestService";

export const entranceTestHandler: EntranceTestServiceServer = {
  startTest: async (
    call: grpc.ServerUnaryCall<StartTestRequest, StartTestResponse>,
    callback: grpc.sendUnaryData<StartTestResponse>,
  ) => {
    try {
      const { email } = call.request;
      if (!email) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: "email is required",
        });
      }

      const result = await entranceTestService.startTest(email);

      callback(null, {
        attemptId: result.attemptId,
        round: result.round,
        questions: result.questions,
      });
    } catch (error: any) {
      console.error("startTest error:", error.message);
      callback({ code: grpc.status.INTERNAL, message: error.message });
    }
  },

  submitRound: async (
    call: grpc.ServerUnaryCall<SubmitRoundRequest, SubmitRoundResponse>,
    callback: grpc.sendUnaryData<SubmitRoundResponse>,
  ) => {
    try {
      const { email, answers } = call.request;
      if (!email) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: "email is required",
        });
      }
      if (!answers || answers.length === 0) {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          message: "answers are required",
        });
      }

      const result = await entranceTestService.submitRound(
        email,
        answers.map((a) => ({
          questionId: a.questionId,
          selectedOption: a.selectedOption,
        })),
      );

      callback(null, {
        done: result.done,
        skillLevel: "skillLevel" in result ? (result.skillLevel ?? "") : "",
        nextQuestions: result.nextQuestions ?? [],
        round: "round" in result ? (result.round ?? 0) : 0,
      });
    } catch (error: any) {
      console.error("submitRound error:", error.message);
      callback({ code: grpc.status.INTERNAL, message: error.message });
    }
  },
};
