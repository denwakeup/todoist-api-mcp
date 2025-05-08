import { ServerOptions } from 'fastmcp';

import { TodoistMCPSession } from '../types';

export const createAuthResolver = (mcpAccessToken?: string) => {
  const authResolver: ServerOptions<TodoistMCPSession>['authenticate'] = async (
    request
  ) => {
    const requestMcpToken = request.headers?.authorization?.replace(
      /^Bearer\s+/,
      ''
    );

    if (mcpAccessToken && requestMcpToken !== mcpAccessToken) {
      throw new Response(null, {
        status: 401,
        statusText: 'Unauthorized',
      });
    }

    const rawTodoistApiToken =
      request.headers?.['X-Todoist-Token'] ||
      request.headers?.['x-todoist-token'];

    const todoistApiToken = Array.isArray(rawTodoistApiToken)
      ? rawTodoistApiToken[0]
      : rawTodoistApiToken;

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
