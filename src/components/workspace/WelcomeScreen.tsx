import { Center, Container, Stack, Text, Title } from "@mantine/core";
import { WorkspaceSelector } from "./WorkspaceSelector";

interface WelcomeScreenProps {
  onWorkspaceReady: (path: string) => void;
}

export function WelcomeScreen({ onWorkspaceReady }: WelcomeScreenProps) {
  return (
    <Center mih="100vh" px="md">
      <Container size="sm" w="100%">
        <Stack gap="xl">
          <Stack gap="xs" ta="center">
            <Title order={1}>Welcome to ShadowNetra</Title>
            <Text c="dimmed">
              Offline-first geospatial intelligence management. Set up a
              workspace to get started.
            </Text>
          </Stack>

          <WorkspaceSelector onWorkspaceReady={onWorkspaceReady} />
        </Stack>
      </Container>
    </Center>
  );
}
