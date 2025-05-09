import { UserError } from 'fastmcp';
import { z } from 'zod';

import { TodoistMCP, TodoistApiResolver } from '../types';

export function setupSectionHandlers(
  server: TodoistMCP,
  resolveApi: TodoistApiResolver
): void {
  server.addTool({
    name: 'getSections',
    description:
      'Get a list of sections in Todoist with the ability to filter by project',
    parameters: z.object({
      projectId: z
        .string()
        .nullable()
        .describe("Project ID for filtering sections (example: '2207306141')"),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        const sections = await api.getSections(args);
        return {
          content: [{ type: 'text', text: JSON.stringify(sections) }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'createSection',
    description:
      'Create a new section in a Todoist project specifying name and order',
    parameters: z.object({
      name: z.string().describe('Section name (required)'),
      projectId: z
        .string()
        .describe(
          "Project ID for creating the section (example: '2207306141')"
        ),
      order: z
        .number()
        .optional()
        .nullable()
        .describe('Section order in the project (starting from 1)'),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        const section = await api.addSection(args);
        return {
          content: [{ type: 'text', text: JSON.stringify(section) }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'updateSection',
    description:
      'Update an existing section in Todoist with the ability to change name and order',
    parameters: z.object({
      id: z.string().describe("Unique section identifier (example: '7025')"),
      name: z.string().describe('New section name (required)'),
      order: z
        .number()
        .optional()
        .nullable()
        .describe('New section order (starting from 1)'),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        const { id, ...updateArgs } = args;
        const section = await api.updateSection(id, updateArgs);
        return {
          content: [{ type: 'text', text: JSON.stringify(section) }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'deleteSection',
    description:
      'Delete a section from Todoist without removing associated tasks',
    parameters: z.object({
      id: z
        .string()
        .describe("Unique section identifier to delete (example: '7025')"),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        await api.deleteSection(args.id);
        return {
          content: [{ type: 'text', text: 'Section deleted successfully' }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'getSection',
    description: 'Get information about a specific section by its ID',
    parameters: z.object({
      id: z.string().describe("Unique section identifier (example: '7025')"),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        const section = await api.getSection(args.id);
        return {
          content: [{ type: 'text', text: JSON.stringify(section) }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });
}
