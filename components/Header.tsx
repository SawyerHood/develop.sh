import {
  GearIcon,
  GitHubLogoIcon,
  PlayIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import {
  Button,
  Card,
  Dialog,
  Flex,
  Heading,
  IconButton,
} from "@radix-ui/themes";
import { SettingsDialog } from "./SettingsDialog";
import { useAtom, useAtomValue } from "jotai";
import { loadingByPromptIdAtom, promptsAtom } from "@/state/prompts";

const ICON_SIZE = 20;

export function Header() {
  const [loadingByPromptId, setLoadingByPromptId] = useAtom(
    loadingByPromptIdAtom
  );
  const [prompts, dispatch] = useAtom(promptsAtom);
  return (
    <Flex
      align="center"
      p="3"
      gap="4"
      style={{
        borderBottom: "1px solid var(--base-card-classic-border-color)",
      }}
    >
      <Heading size="4">develop.sh</Heading>
      <a
        style={{ marginLeft: "auto" }}
        className="rt-reset rt-BaseButton rt-r-size-2 rt-variant-ghost rt-IconButton"
        href="https://github.com/sawyerhood/develop.sh"
      >
        <GitHubLogoIcon width={ICON_SIZE} height={ICON_SIZE} />
      </a>
      <IconButton
        variant="ghost"
        onClick={() => {
          dispatch({ type: "ADD_PROMPT" });
        }}
      >
        <PlusIcon width={ICON_SIZE} height={ICON_SIZE} />
      </IconButton>
      <Dialog.Root>
        <Dialog.Trigger>
          <IconButton variant="ghost">
            <GearIcon width={ICON_SIZE} height={ICON_SIZE} />
          </IconButton>
        </Dialog.Trigger>
        <SettingsDialog />
      </Dialog.Root>
      <IconButton
        variant="ghost"
        onClick={() => {
          const forms = document.querySelectorAll("form");
          for (const f of Array.from(forms)) {
            f.submit();
          }
          setLoadingByPromptId(
            Object.fromEntries(prompts.map((p) => [p.id, "loading"]))
          );
        }}
      >
        <PlayIcon width={ICON_SIZE} height={ICON_SIZE} />
      </IconButton>
    </Flex>
  );
}
