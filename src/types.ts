import { TodoistApi } from '@doist/todoist-api-typescript';
import { FastMCP } from 'fastmcp';

export type TodoistMCPSession = { apiToken: string };
export type TodoistMCP = FastMCP<TodoistMCPSession>;
export type TodoistApiResolver = (
  session: TodoistMCPSession | undefined
) => TodoistApi;
