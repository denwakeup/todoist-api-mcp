import { UserError } from 'fastmcp';
import { z } from 'zod';

import { TodoistMCP, TodoistApiResolver } from '../types';
import { TodoistColor } from '../constants/colors';

export function setupLabelHandlers(
  server: TodoistMCP,
  resolveApi: TodoistApiResolver
): void {
  server.addTool({
    name: 'getLabels',
    description: 'Get a list of all labels in Todoist',
    execute: async (_, { session }) => {
      const api = resolveApi(session);

      try {
        const labels = await api.getLabels();
        return {
          content: [{ type: 'text', text: JSON.stringify(labels) }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'createLabel',
    description: 'Create a new label in Todoist',
    parameters: z.object({
      name: z.string().describe('Label name (required field)'),
      color: TodoistColor.optional().nullable().describe('Label color'),
      order: z
        .number()
        .optional()
        .nullable()
        .describe(
          'Label order in the list of labels. Determines position among other labels.'
        ),
      isFavorite: z
        .boolean()
        .optional()
        .nullable()
        .describe('Add label to favorites'),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        const label = await api.addLabel({
          ...args,
          color: args.color ?? undefined,
          isFavorite: args.isFavorite ?? undefined,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(label) }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'updateLabel',
    description: 'Update an existing label in Todoist',
    parameters: z.object({
      id: z.string().describe('Unique label identifier for updating'),
      name: z.string().optional().nullable().describe('New label name'),
      color: TodoistColor.optional().nullable().describe('New label color'),
      order: z
        .number()
        .optional()
        .nullable()
        .describe('New order of the label in the list of labels'),
      isFavorite: z
        .boolean()
        .optional()
        .nullable()
        .describe('Add/remove from favorites'),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        const { id, ...updateArgs } = args;
        const label = await api.updateLabel(id, {
          ...updateArgs,
          name: updateArgs.name ?? undefined,
          color: updateArgs.color ?? undefined,
          isFavorite: updateArgs.isFavorite ?? undefined,
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(label) }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'deleteLabel',
    description: 'Delete a label from Todoist',
    parameters: z.object({
      id: z.string().describe('Unique label identifier to delete'),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        await api.deleteLabel(args.id);
        return {
          content: [{ type: 'text', text: 'Label deleted successfully' }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'getLabel',
    description: 'Get information about a specific label by its ID',
    parameters: z.object({
      id: z.string().describe('Unique label identifier'),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        const label = await api.getLabel(args.id);
        return {
          content: [{ type: 'text', text: JSON.stringify(label) }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });
}
