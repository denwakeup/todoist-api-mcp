import { FastMCP, ServerOptions } from 'fastmcp';

import { setupCommentHandlers } from './handlers/comments';
import { setupLabelHandlers } from './handlers/labels';
import { setupProjectHandlers } from './handlers/projects';
import { setupSectionHandlers } from './handlers/sections';
import { setupTaskHandlers } from './handlers/tasks';
import { TodoistApiResolver, TodoistMCP, TodoistMCPSession } from './types';

interface Params {
  todoistApiResolver: TodoistApiResolver;
  authenticate?: ServerOptions<TodoistMCPSession>['authenticate'];
}

export const createMcpSever = ({
  todoistApiResolver,
  authenticate,
}: Params): TodoistMCP => {
  const server = new FastMCP<TodoistMCPSession>({
    name: 'todoist',
    version: '1.0.0',
    authenticate,
  });

  setupTaskHandlers(server, todoistApiResolver);
  setupProjectHandlers(server, todoistApiResolver);
  setupLabelHandlers(server, todoistApiResolver);
  setupSectionHandlers(server, todoistApiResolver);
  setupCommentHandlers(server, todoistApiResolver);

  return server;
};
