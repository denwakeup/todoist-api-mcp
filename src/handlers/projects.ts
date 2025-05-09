import { UserError } from 'fastmcp';
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
        .nullable()
        .describe("Parent project ID (example: '2207306141')"),
      color: TodoistColor.optional().nullable().describe('Project color'),
      isFavorite: z
        .boolean()
        .optional()
        .nullable()
        .describe('Add to favorites (true/false)'),
      viewStyle: z
        .enum(['list', 'board'])
        .optional()
        .nullable()
        .describe("Project view style: 'list' or 'board'"),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        const project = await api.addProject({
          ...args,
          parentId: args.parentId ?? undefined,
          color: args.color ?? undefined,
          isFavorite: args.isFavorite ?? undefined,
          viewStyle: args.viewStyle ?? undefined,
        });
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
      isFavorite: z
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
}
