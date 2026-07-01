import { useState } from "react";
import { Alert, Button, Group, Stack, Text } from "@mantine/core";
import { workspaceService } from "../../services/WorkspaceService";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return fallback;
}

interface WorkspaceSelectorProps {
  onWorkspaceReady: (path: string) => void;
}

export function WorkspaceSelector({ onWorkspaceReady }: WorkspaceSelectorProps) {
  const [error, setError] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<"create" | "open" | null>(
    null,
  );

  async function handleCreateWorkspace() {
    setError(null);
    setLoadingAction("create");

    try {
      const selectedPath = await workspaceService.pickFolder(
        "Choose a folder for your new workspace",
      );

      if (!selectedPath) {
        return;
      }

      await workspaceService.createWorkspace(selectedPath);
      onWorkspaceReady(selectedPath);
    } catch (createError) {
      setError(getErrorMessage(createError, "Failed to create workspace."));
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleOpenWorkspace() {
    setError(null);
    setLoadingAction("open");

    try {
      const selectedPath = await workspaceService.pickFolder(
        "Open an existing workspace folder",
      );

      if (!selectedPath) {
        return;
      }

      await workspaceService.openWorkspace(selectedPath);
      onWorkspaceReady(selectedPath);
    } catch (openError) {
      setError(getErrorMessage(openError, "Failed to open workspace."));
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <Stack gap="md">
      <Text size="sm" c="dimmed">
        Choose a folder on your computer to store intelligence data. All files
        remain local and offline.
      </Text>

      {error ? (
        <Alert color="red" title="Workspace error">
          {error}
        </Alert>
      ) : null}

      <Group justify="center" gap="md">
        <Button
          size="md"
          loading={loadingAction === "create"}
          disabled={loadingAction !== null && loadingAction !== "create"}
          onClick={() => {
            void handleCreateWorkspace();
          }}
        >
          Create New Workspace
        </Button>
        <Button
          size="md"
          variant="light"
          loading={loadingAction === "open"}
          disabled={loadingAction !== null && loadingAction !== "open"}
          onClick={() => {
            void handleOpenWorkspace();
          }}
        >
          Open Existing Workspace
        </Button>
      </Group>
    </Stack>
  );
}
