"use client";

import { Flex } from "@radix-ui/themes";
import { Header } from "@/components/Header";
import { Prompt } from "@/components/Prompt";
import { promptsAtom } from "@/state/prompts";
import { useAtomValue } from "jotai";

export default function Home() {
  const prompts = useAtomValue(promptsAtom);

  return (
    <Flex direction="column" style={{ height: "100vh" }} gap="10px">
      <Header />
      <Flex direction="row" style={{ width: "100%", flexGrow: 1 }}>
        {prompts.map((prompt) => (
          <Prompt key={prompt.id} id={prompt.id} />
        ))}
      </Flex>
    </Flex>
  );
}
