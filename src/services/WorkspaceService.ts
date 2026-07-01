import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

const WORKSPACE_DIALOG_TITLE = "Select Workspace Folder";

export class WorkspaceService {
  async getConfiguredWorkspace(): Promise<string | null> {
    return invoke<string | null>("get_workspace_path");
  }

  async isWorkspaceConfiguredAndValid(): Promise<boolean> {
    return invoke<boolean>("is_workspace_valid");
  }

  async pickFolder(title = WORKSPACE_DIALOG_TITLE): Promise<string | null> {
    const selected = await open({
      title,
      directory: true,
      multiple: false,
    });

    if (selected === null) {
      return null;
    }

    return selected;
  }

  async createWorkspace(path: string): Promise<void> {
    await invoke("create_workspace", { path });
  }

  async openWorkspace(path: string): Promise<void> {
    await invoke("open_workspace", { path });
  }
}

export const workspaceService = new WorkspaceService();
