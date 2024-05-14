import { MODELS_GROUPED_BY_PROVIDER, selectKeyForModel } from "@/ai/models";
import { loadingByPromptIdAtom, promptsAtom } from "@/state/prompts";
import { anthropicKeyAtom, groqKeyAtom, openAiKeyAtom } from "@/state/settings";
import {
  ExclamationTriangleIcon,
  MixerHorizontalIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import {
  Box,
  Callout,
  Card,
  Flex,
  Heading,
  IconButton,
  Popover,
  Progress,
  Select,
  Slider,
  Spinner,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { useAtom, useAtomValue } from "jotai";
import React from "react";

export function Prompt({ id }: { id: string }) {
  const [prompts, dispatch] = useAtom(promptsAtom);
  const [loadingByPromptId, setLoadingByPromptId] = useAtom(
    loadingByPromptIdAtom
  );

  const iframeState = loadingByPromptId[id] ?? "none";

  const prompt = prompts.find((prompt) => prompt.id === id)!;

  const openAiKey = useAtomValue(openAiKeyAtom);
  const anthropicKey = useAtomValue(anthropicKeyAtom);
  const groqKey = useAtomValue(groqKeyAtom);

  const key = selectKeyForModel(prompt.model, {
    openai: openAiKey,
    anthropic: anthropicKey,
    groq: groqKey,
  });

  return (
    <Card style={{ position: "relative", margin: "12px 0", flex: 1 }}>
      <form
        target={`output-${id}`}
        action="/api/html"
        method="post"
        style={{
          display: "contents",
        }}
        onSubmit={(e) => e.preventDefault()}
      >
        {prompts.length > 1 && (
          <IconButton
            variant="ghost"
            style={{ position: "absolute", top: 12, right: 20 }}
            onClick={() => dispatch({ type: "REMOVE_PROMPT", payload: id })}
          >
            <TrashIcon />
          </IconButton>
        )}
        <Flex width="100%" direction="column" gap="10px" height="100%">
          <Text color="gray">Model</Text>
          <Flex width="100%" gap="1">
            <Select.Root
              value={prompt.model}
              onValueChange={(v) =>
                dispatch({
                  type: "UPDATE_PROMPT",
                  payload: { id, model: v },
                })
              }
              name="model"
            >
              <Select.Trigger style={{ flex: 1 }} />
              <Select.Content>
                {Object.entries(MODELS_GROUPED_BY_PROVIDER).map(
                  ([provider, models], index) => (
                    <React.Fragment key={provider}>
                      <Select.Group key={provider}>
                        <Select.Label>{provider}</Select.Label>
                        {models.map((model) => (
                          <Select.Item key={model} value={model}>
                            {model}
                          </Select.Item>
                        ))}
                      </Select.Group>
                      {index <
                        Object.keys(MODELS_GROUPED_BY_PROVIDER).length - 1 && (
                        <Select.Separator />
                      )}
                    </React.Fragment>
                  )
                )}
              </Select.Content>
            </Select.Root>
            <Settings id={id} />
          </Flex>
          <Flex width="100%" direction="column">
            <Text color="gray">System</Text>
            <TextArea
              resize="vertical"
              name="system"
              value={prompt.system}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_PROMPT",
                  payload: { id, system: e.target.value },
                })
              }
            />
          </Flex>
          <Flex width="100%" direction="column">
            <Text color="gray">User</Text>
            <TextArea
              resize="vertical"
              name="user"
              value={prompt.user}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_PROMPT",
                  payload: { id, user: e.target.value },
                })
              }
            />
          </Flex>
          <input type="hidden" name="key" value={key} />
          <input type="hidden" name="temperature" value={prompt.temperature} />
          <input type="hidden" name="maxTokens" value={prompt.maxTokens} />
          <input type="hidden" name="topP" value={prompt.topP} />
          {!key && (
            <Callout.Root color="red">
              <Callout.Icon>
                <ExclamationTriangleIcon />
              </Callout.Icon>
              <Callout.Text>
                Please set your key for this model in the settings
              </Callout.Text>
            </Callout.Root>
          )}
          {iframeState === "loading" && (
            <Box position="relative">
              <Box position="absolute" top="8px" left="0" right="0">
                <Progress duration="30s" />
              </Box>
            </Box>
          )}
          <Box
            position="relative"
            top="12px"
            height="100%"
            style={{
              zIndex: 100,
              display: iframeState === "none" ? "none" : "contents",
              flex: 1,
            }}
          >
            <iframe
              width="100%"
              style={{ alignSelf: "stretch", flex: 1 }}
              name={`output-${id}`}
              id={`output-${id}`}
              onLoad={() => {
                setLoadingByPromptId({
                  ...loadingByPromptId,
                  [id]: "finished",
                });
              }}
            />
          </Box>
          {iframeState === "none" && (
            <Card
              style={{
                width: "100%",
                alignSelf: "stretch",
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Heading color="gray">Preview</Heading>
            </Card>
          )}
        </Flex>
      </form>
    </Card>
  );
}

function Settings({ id }: { id: string }) {
  const [prompts, dispatch] = useAtom(promptsAtom);
  const prompt = prompts.find((prompt) => prompt.id === id)!;
  return (
    <Popover.Root>
      <Popover.Trigger>
        <IconButton>
          <MixerHorizontalIcon />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content width="360px">
        <Flex gap="3" direction="column">
          <Box width="100%">
            <label>
              <Flex direction="column" gap="2">
                <Flex direction="row" justify="between">
                  <Text color="gray">Temperature</Text>
                  <Text>{prompt.temperature}</Text>
                </Flex>
                <Slider
                  name="temperature"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[prompt.temperature]}
                  onValueChange={(v) =>
                    dispatch({
                      type: "UPDATE_PROMPT",
                      payload: { id, temperature: v[0] },
                    })
                  }
                />
              </Flex>
            </label>
          </Box>
          <Box width="100%">
            <label>
              <Flex direction="column" gap="2">
                <Flex direction="row" justify="between">
                  <Text color="gray">Max Tokens</Text>
                  <Text>{prompt.maxTokens}</Text>
                </Flex>
                <Slider
                  name="maxTokens"
                  min={1}
                  max={8192}
                  step={1}
                  value={[prompt.maxTokens]}
                  onValueChange={(v) =>
                    dispatch({
                      type: "UPDATE_PROMPT",
                      payload: { id, maxTokens: v[0] },
                    })
                  }
                />
              </Flex>
            </label>
          </Box>
          <Box width="100%">
            <label>
              <Flex direction="column" gap="2">
                <Flex direction="row" justify="between">
                  <Text color="gray">Top P</Text>
                  <Text>{prompt.topP}</Text>
                </Flex>
                <Slider
                  name="topP"
                  min={0}
                  max={1}
                  step={0.01}
                  value={[prompt.topP]}
                  onValueChange={(v) =>
                    dispatch({
                      type: "UPDATE_PROMPT",
                      payload: { id, topP: v[0] },
                    })
                  }
                />
              </Flex>
            </label>
          </Box>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}
