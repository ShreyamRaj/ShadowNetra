import { useEffect, useState } from "react";
import { Center, Container, Loader, Stack, Text, Title } from "@mantine/core";
import { WelcomeScreen } from "./components/workspace/WelcomeScreen";
import { workspaceService } from "./services/WorkspaceService";

function AppShell({ workspacePath }: { workspacePath: string }) {
  return (
    <Center mih="100vh" px="md">
      <Container size="md" w="100%">
        <Stack gap="md">
          <Title order={2}>ShadowNetra</Title>
          <Text c="dimmed">Workspace ready.</Text>
          <Text size="sm" ff="monospace">
            {workspacePath}
          </Text>
        </Stack>
      </Container>
    </Center>
  );
}

function App() {
  const [workspacePath, setWorkspacePath] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadWorkspace() {
      try {
        const isValid = await workspaceService.isWorkspaceConfiguredAndValid();

        if (!isMounted) {
          return;
        }

        if (isValid) {
          const path = await workspaceService.getConfiguredWorkspace();
          setWorkspacePath(path);
        } else {
          setWorkspacePath(null);
        }
      } catch {
        if (isMounted) {
          setWorkspacePath(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadWorkspace();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <Center mih="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (!workspacePath) {
    return (
      <WelcomeScreen
        onWorkspaceReady={(path) => {
          setWorkspacePath(path);
        }}
      />
    );
  }

  return <AppShell workspacePath={workspacePath} />;
}

export default App;
