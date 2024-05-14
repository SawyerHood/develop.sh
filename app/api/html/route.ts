import { createClient } from "@/ai/client";

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

  return new Response(
    new ReadableStream({
      async start(controller) {
        const programStream = await createProgramStream({
          system,
          user,
          model,
          key,
          temperature,
          maxTokens,
          topP,
        });

        let programResult = "";

        let startedSending = false;
        let sentIndex = 0;

        for await (const chunk of programStream) {
          const value = chunk.choices[0]?.delta?.content || "";

          programResult += value;

          if (startedSending) {
            const match = programResult.match(/<\/html>/);
            if (match) {
              controller.enqueue(
                programResult.slice(sentIndex, match.index! + match[0].length)
              );
              break;
            } else {
              controller.enqueue(value);
              sentIndex = programResult.length;
            }
          } else {
            const match = programResult.match(/<html/);
            if (match) {
              programResult =
                "<!DOCTYPE html>\n" + programResult.slice(match.index!);
              controller.enqueue(programResult);
              sentIndex = programResult.length;
              startedSending = true;
            }
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 50));
        controller.close();
      },
    }).pipeThrough(new TextEncoderStream()),
    {
      headers: {
        "Content-Type": "text/html",
      },
      status: 200,
    }
  );
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
