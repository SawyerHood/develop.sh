import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type Prompt = {
  id: string;
  system: string;
  user: string;
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
};

export const DEFAULT_PROMPT: Prompt = {
  id: crypto.randomUUID(),
  system:
    "The user will describe a website. Return a standalone html file for the website. Wrap the website in ```html quotes.",
  user: "Pong",
  model: "gpt-3.5-turbo",
  temperature: 0.5,
  maxTokens: 1024,
  topP: 1,
};

const privatePromptsAtom = atomWithStorage<Prompt[]>("privatePrompts", [
  DEFAULT_PROMPT,
]);

type Action =
  | {
      type: "ADD_PROMPT";
    }
  | {
      type: "REMOVE_PROMPT";
      payload: string;
    }
  | {
      type: "UPDATE_PROMPT";
      payload: Partial<Prompt> & { id: string };
    };

function promptsReducer(state: Prompt[], action: Action) {
  switch (action.type) {
    case "ADD_PROMPT": {
      const newPrompt = state.length
        ? { ...state[state.length - 1], id: crypto.randomUUID() }
        : { ...DEFAULT_PROMPT, id: crypto.randomUUID() };
      return [...state, newPrompt];
    }

    case "REMOVE_PROMPT":
      return state.filter((prompt) => prompt.id !== action.payload);
    case "UPDATE_PROMPT":
      return state.map((prompt) =>
        prompt.id === action.payload.id
          ? { ...prompt, ...action.payload }
          : prompt
      );
    default:
      return state;
  }
}

export const promptsAtom = atom<Prompt[], [Action], any>(
  (get) => {
    return get(privatePromptsAtom);
  },
  (get, set, action) => {
    set(privatePromptsAtom, promptsReducer(get(privatePromptsAtom), action));
  }
);

export const loadingByPromptIdAtom = atom<
  Record<string, "loading" | "finished" | "none">
>({});
