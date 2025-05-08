import { UserError } from 'fastmcp';
import { AddProjectArgs, GetTasksArgs } from '@doist/todoist-api-typescript';
import { z } from 'zod';

import { TodoistMCP, TodoistApiResolver } from '../types';
import { TodoistColor } from '../constants/colors';

export function setupProjectHandlers(
  server: TodoistMCP,
  resolveApi: TodoistApiResolver
): void {
  server.addTool({
    name: 'getProjects',
    parameters: z.object({}),
    description: 'Get a list of all projects in Todoist',
    execute: async (_, { session }) => {
      const api = resolveApi(session);
      try {
        const projects = await api.getProjects();
        return {
          content: [{ type: 'text', text: JSON.stringify(projects) }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'createProject',
    description: 'Create a new project in Todoist',
    parameters: z.object({
      name: z.string().describe('Project name (required)'),
      parentId: z
        .string()
        .optional()
        .describe("Parent project ID (example: '2207306141')"),
      color: TodoistColor.optional().describe('Project color'),
      favorite: z
        .boolean()
        .optional()
        .describe('Add to favorites (true/false)'),
      viewStyle: z
        .enum(['list', 'board'])
        .optional()
        .describe("Project view style: 'list' or 'board'"),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        const project = await api.addProject(args as AddProjectArgs);
        return {
          content: [{ type: 'text', text: JSON.stringify(project) }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'updateProject',
    description: 'Update an existing project in Todoist',
    parameters: z.object({
      id: z
        .string()
        .describe("Unique project identifier (example: '2207306141')"),
      name: z.string().optional().describe('New project name'),
      color: TodoistColor.optional().describe('New project color'),
      favorite: z
        .boolean()
        .optional()
        .describe('Add/remove from favorites (true/false)'),
      viewStyle: z
        .enum(['list', 'board'])
        .optional()
        .describe("New view style: 'list' or 'board'"),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        const { id, ...updateArgs } = args;
        const project = await api.updateProject(id, updateArgs);
        return {
          content: [{ type: 'text', text: JSON.stringify(project) }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'deleteProject',
    description: 'Delete a project from Todoist',
    parameters: z.object({
      id: z
        .string()
        .describe(
          "Unique project identifier to delete (example: '2207306141')"
        ),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        await api.deleteProject(args.id);
        return {
          content: [{ type: 'text', text: 'Project deleted successfully' }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'getProject',
    description: 'Get information about a specific project by its ID',
    parameters: z.object({
      id: z
        .string()
        .describe("Unique project identifier (example: '2207306141')"),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        const project = await api.getProject(args.id);
        return {
          content: [{ type: 'text', text: JSON.stringify(project) }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'getProjectTasks',
    description: 'Get a list of tasks from a specific project',
    parameters: z.object({
      projectId: z.string().describe("Project ID (example: '2207306141')"),
      sectionId: z
        .string()
        .optional()
        .describe("Section ID for filtering (example: '7025')"),
      label: z
        .string()
        .optional()
        .describe("Label name for filtering (example: 'important')"),
      filter: z
        .string()
        .optional()
        .describe(
          "Filter string in Todoist format (example: 'today & @important')"
        ),
      ids: z
        .array(z.string())
        .optional()
        .describe(
          "Array of task IDs to retrieve specific tasks (example: ['123', '456'])"
        ),
      parentId: z
        .string()
        .optional()
        .describe("Parent task ID to retrieve subtasks (example: '7025')"),
      cursor: z
        .string()
        .nullable()
        .optional()
        .describe('Cursor for pagination (obtained from previous request)'),
      limit: z
        .number()
        .optional()
        .describe('Limit on the number of tasks (default: 30, maximum: 50)'),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        const tasks = await api.getTasks(args as GetTasksArgs);
        return {
          content: [{ type: 'text', text: JSON.stringify(tasks) }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });
}
