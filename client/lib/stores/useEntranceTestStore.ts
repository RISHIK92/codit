import { create } from "zustand";
import {
  startEntranceTest,
  submitEntranceRound,
  type EntranceQuestionDTO,
  type AnswerPayload,
} from "@/lib/api/entranceTestApi";

interface EntranceTestState {
  // current questions being shown
  questions: EntranceQuestionDTO[];
  round: number;
  loading: boolean;
  submitting: boolean;
  done: boolean;
  resultLevel: string | null;
  error: string | null;

  start: (idToken: string) => Promise<void>;
  submit: (idToken: string, answers: AnswerPayload[]) => Promise<void>;
  reset: () => void;
}

const INITIAL: Pick<
  EntranceTestState,
  | "questions"
  | "round"
  | "loading"
  | "submitting"
  | "done"
  | "resultLevel"
  | "error"
> = {
  questions: [],
  round: 1,
  loading: false,
  submitting: false,
  done: false,
  resultLevel: null,
  error: null,
};

export const useEntranceTestStore = create<EntranceTestState>((set) => ({
  ...INITIAL,

  start: async (idToken) => {
    set({ loading: true, error: null, done: false, resultLevel: null });
    try {
      const res = await startEntranceTest(idToken);
      set({
        questions: res.questions,
        round: res.round,
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message ?? "Failed to start test", loading: false });
    }
  },

  submit: async (idToken, answers) => {
    set({ submitting: true, error: null });
    try {
      const res = await submitEntranceRound(idToken, answers);
      if (res.done) {
        set({ done: true, resultLevel: res.skill_level, submitting: false });
      } else {
        set({
          questions: res.next_questions,
          round: res.round,
          submitting: false,
        });
      }
    } catch (err: any) {
      set({
        error: err.message ?? "Failed to submit answers",
        submitting: false,
      });
    }
  },

  reset: () => set(INITIAL),
}));
