import { todoistApiResolver } from './helpers/todoistApiResolver';
import { createMcpSever } from './createMcpSever';
import { DEFAULT_MODE, DEFAULT_PORT } from './constants';
import { createAuthResolver } from './helpers/authenticateResolver';

interface Params {
  mode: string | undefined;
  port: number | undefined;
  apiToken: string | undefined;
  mcpAccessToken: string | undefined;
}

export const startMcpServer = async ({
  mode = DEFAULT_MODE,
  port = DEFAULT_PORT,
  apiToken,
  mcpAccessToken,
}: Params): Promise<void> => {
  if (mode === 'stdio') {
    const server = createMcpSever({
      todoistApiResolver: () =>
        todoistApiResolver(apiToken ? { apiToken } : undefined),
    });

    return await server.start({
      transportType: 'stdio',
    });
  }

  if (mode === 'sse') {
    const server = createMcpSever({
      authenticate: createAuthResolver(mcpAccessToken),
      todoistApiResolver,
    });

    return await server.start({
      transportType: 'sse',
      sse: {
        endpoint: '/sse',
        port,
      },
    });
  }

  if (mode === 'httpStream') {
    const server = createMcpSever({
      authenticate: createAuthResolver(mcpAccessToken),
      todoistApiResolver,
    });

    return await server.start({
      transportType: 'httpStream',
      httpStream: {
        endpoint: '/mcp',
        port,
      },
    });
  }

  throw new Error('Invalid mode');
};
