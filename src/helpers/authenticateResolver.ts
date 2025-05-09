import { ServerOptions } from 'fastmcp';

import { TodoistMCPSession } from '../types';

export const createAuthResolver = (mcpAccessToken?: string) => {
  const authResolver: ServerOptions<TodoistMCPSession>['authenticate'] = async (
    request
  ) => {
    const requestMcpToken =
      request.headers?.['X-Mcp-Token'] || request.headers?.['x-mcp-token'];

    const normalizedMcpToken = Array.isArray(requestMcpToken)
      ? requestMcpToken[0]
      : requestMcpToken;

    if (mcpAccessToken && normalizedMcpToken !== mcpAccessToken) {
      throw new Response(null, {
        status: 401,
        statusText: 'Unauthorized - Invalid MCP token',
      });
    }

    const todoistApiToken = request.headers?.authorization?.replace(
      /^Bearer\s+/,
      ''
    );

    if (!todoistApiToken) {
      throw new Response(null, {
        status: 401,
        statusText: 'Unauthorized - Missing Todoist API token',
      });
    }

    return { apiToken: todoistApiToken };
  };

  return authResolver;
};
