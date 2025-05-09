#!/usr/bin/env node
import { Command, Option } from '@commander-js/extra-typings';

import { startMcpServer } from './startMcpServer';
import { DEFAULT_PORT, TransportMode } from './constants';

const bootstrap = () => {
  const program = new Command();

  program
    .name('todoist-api-mcp')
    .description('Todoist MCP Server')
    .addOption(
      new Option('-m, --mode <mode>', 'Transport mode')
        .choices(Object.values(TransportMode))
        .default(TransportMode.stdio)
    )
    .addOption(
      new Option(
        '-t, --todoist-token <todoist-token>',
        'stdio: Todoist API Token'
      ).env('TODOIST_API_TOKEN')
    )
    .addOption(
      new Option(
        '-a, --mcp-access-token <mcp-access-token>',
        'sse, httpStream: Token for MCP server access validation'
      ).env('MCP_ACCESS_TOKEN')
    )
    .addOption(
      new Option('-p, --port <port>', 'sse, httpstream: server port')
        .argParser(parseInt)
        .default(DEFAULT_PORT)
    )
    .action(async (options) => {
      if (options.mode === TransportMode.stdio) {
        if (!options.todoistToken) {
          // eslint-disable-next-line no-console
          console.error('Token required for stdio mode');
          process.exit(1);
        }

        if (options.mcpAccessToken) {
          // eslint-disable-next-line no-console
          console.warn('MCP access token is not supported for stdio mode');
        }
      } else {
        if (options.todoistToken) {
          // eslint-disable-next-line no-console
          console.warn(
            'sse, httpStream modes use Todoist API token from Authorization: Bearer TOKEN header'
          );
        }
      }

      await startMcpServer({
        mode: options.mode,
        port: options.port,
        apiToken: options.todoistToken,
        mcpAccessToken: options.mcpAccessToken,
      });
    })
    .parse();
};

bootstrap();
