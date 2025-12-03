import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export interface MCPClientConfig {
  command: string;
  args?: string[];
  env?: Record<string, string | undefined>;
}

export class MCPClient {
  private client: Client;
  private transport: StdioClientTransport;
  private isConnected: boolean = false;

  constructor(private config: MCPClientConfig) {
    this.client = new Client({
      name: "google-ads-ai-agent",
      version: "1.0.0",
    }, {
      capabilities: {}
    });

    // Filter out undefined values from env
    const env = config.env
      ? Object.fromEntries(
          Object.entries(config.env).filter(([_, v]) => v !== undefined)
        ) as Record<string, string>
      : undefined;

    this.transport = new StdioClientTransport({
      command: config.command,
      args: config.args || [],
      env,
    });
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    await this.client.connect(this.transport);
    this.isConnected = true;
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    await this.client.close();
    this.isConnected = false;
  }

  async listTools(): Promise<any[]> {
    if (!this.isConnected) {
      await this.connect();
    }

    const response = await this.client.listTools();
    return response.tools;
  }

  async callTool(name: string, args: Record<string, any>): Promise<any> {
    if (!this.isConnected) {
      await this.connect();
    }

    const response = await this.client.callTool({
      name,
      arguments: args,
    });

    return response;
  }

  async listResources(): Promise<any[]> {
    if (!this.isConnected) {
      await this.connect();
    }

    const response = await this.client.listResources();
    return response.resources;
  }

  async readResource(uri: string): Promise<any> {
    if (!this.isConnected) {
      await this.connect();
    }

    const response = await this.client.readResource({ uri });
    return response;
  }

  getClient(): Client {
    return this.client;
  }

  isClientConnected(): boolean {
    return this.isConnected;
  }
}
