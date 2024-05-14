import { anthropicKeyAtom, groqKeyAtom, openAiKeyAtom } from "@/state/settings";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useAtom } from "jotai";

export const SettingsDialog = () => {
  const [openAiKey, setOpenAiKey] = useAtom(openAiKeyAtom);
  const [anthropicKey, setAnthropicKey] = useAtom(anthropicKeyAtom);
  const [groqKey, setGroqKey] = useAtom(groqKeyAtom);
  return (
    <Dialog.Content maxWidth="450px">
      <Dialog.Title>Settings</Dialog.Title>
      <Dialog.Description size="2" mb="4">
        Set your API keys.
      </Dialog.Description>

      <Flex direction="column" gap="3">
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            OpenAI API Key
          </Text>
          <TextField.Root
            type="password"
            placeholder="Enter your OpenAI API key"
            value={openAiKey}
            onChange={(e) => setOpenAiKey(e.target.value)}
          />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Anthropic API Key
          </Text>
          <TextField.Root
            type="password"
            placeholder="Enter your Anthropic API key"
            value={anthropicKey}
            onChange={(e) => setAnthropicKey(e.target.value)}
          />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Groq API Key
          </Text>
          <TextField.Root
            type="password"
            placeholder="Enter your Groq API key"
            value={groqKey}
            onChange={(e) => setGroqKey(e.target.value)}
          />
        </label>
      </Flex>

      <Flex gap="3" mt="4" justify="end">
        <Dialog.Close>
          <Button>Close</Button>
        </Dialog.Close>
      </Flex>
    </Dialog.Content>
  );
};
