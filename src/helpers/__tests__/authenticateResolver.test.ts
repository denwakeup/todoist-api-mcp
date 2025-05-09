import { IncomingMessage } from 'node:http';

import { createAuthResolver } from '../authenticateResolver';

describe('createAuthResolver', () => {
  it('should successfully authenticate request with valid tokens', async () => {
    const mcpAccessToken = 'test-mcp-token';
    const todoistApiToken = 'test-todoist-token';
    const authResolver = createAuthResolver(mcpAccessToken);

    const request = {
      headers: {
        'X-Mcp-Token': mcpAccessToken,
        authorization: `Bearer ${todoistApiToken}`,
      },
    };

    const result = await authResolver(request as unknown as IncomingMessage);
    expect(result).toEqual({ apiToken: todoistApiToken });
  });

  it('should throw error with invalid MCP token', async () => {
    const mcpAccessToken = 'test-mcp-token';
    const authResolver = createAuthResolver(mcpAccessToken);

    const request = {
      headers: {
        'X-Mcp-Token': 'wrong-token',
        authorization: 'Bearer test-todoist-token',
      },
    };

    await expect(
      authResolver(request as unknown as IncomingMessage)
    ).rejects.toMatchObject({
      status: 401,
      statusText: 'Unauthorized - Invalid MCP token',
    });
  });

  it('should throw error when Todoist API token is missing', async () => {
    const mcpAccessToken = 'test-mcp-token';
    const authResolver = createAuthResolver(mcpAccessToken);

    const request = {
      headers: {
        'X-Mcp-Token': mcpAccessToken,
      },
    };

    await expect(
      authResolver(request as unknown as IncomingMessage)
    ).rejects.toMatchObject({
      status: 401,
      statusText: 'Unauthorized - Missing Todoist API token',
    });
  });

  it('should work without MCP token if not specified when creating resolver', async () => {
    const todoistApiToken = 'test-todoist-token';
    const authResolver = createAuthResolver();

    const request = {
      headers: {
        authorization: `Bearer ${todoistApiToken}`,
      },
    };

    const result = await authResolver(request as unknown as IncomingMessage);
    expect(result).toEqual({ apiToken: todoistApiToken });
  });
});
