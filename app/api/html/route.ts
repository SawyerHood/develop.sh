import { createClient } from "@/ai/client";
import { streamHtml } from "openai-html-stream";

import { ChatCompletionCreateParamsStreaming } from "openai/resources/index.mjs";

export async function POST(req: Request) {
  const formData = await req.formData();
  const system = formData.get("system")!.toString();
  const user = formData.get("user")!.toString();
  const model = formData.get("model")!.toString();
  const key = formData.get("key")!.toString();
  const temperature = Number(formData.get("temperature")!);
  const maxTokens = Number(formData.get("maxTokens")!);
  const topP = Number(formData.get("topP")!);

  const programStream = await createProgramStream({
    system,
    user,
    model,
    key,
    temperature,
    maxTokens,
    topP,
  });

  return new Response(streamHtml(programStream), {
    headers: {
      "Content-Type": "text/html",
    },
    status: 200,
  });
}

async function createProgramStream({
  system,
  user,
  model,
  key,
  temperature,
  maxTokens,
  topP,
}: {
  system: string;
  user: string;
  model: string;
  key: string;
  temperature: number;
  maxTokens: number;
  topP: number;
}) {
  const params: ChatCompletionCreateParamsStreaming = {
    messages: [
      {
        role: "system",
        content: system,
      },
      {
        role: "user",
        content: user,
      },
    ],
    model: model,
    temperature: Number(temperature),
    max_tokens: Number(maxTokens),
    top_p: Number(topP),
    stream: true,
  };

  console.log(params);

  const stream = await createClient(key).chat.completions.create(params);

  return stream;
}
