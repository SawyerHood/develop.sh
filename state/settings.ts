import { atomWithStorage } from "jotai/utils";

export const openAiKeyAtom = atomWithStorage<string>("openAiKey", "");
export const anthropicKeyAtom = atomWithStorage<string>("anthropicKey", "");
export const groqKeyAtom = atomWithStorage<string>("groqKey", "");
