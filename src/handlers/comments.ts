import { UserError } from 'fastmcp';
import { z } from 'zod';

import { TodoistApiResolver, TodoistMCP } from '../types';

export function setupCommentHandlers(
  server: TodoistMCP,
  resolveApi: TodoistApiResolver
): void {
  server.addTool({
    name: 'getTaskComments',
    description: 'Get a list of comments for a specific task in Todoist',
    parameters: z.object({
      taskId: z.string().describe('Task ID for filtering'),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);

      try {
        const comments = await api.getComments(args);
        return {
          content: [{ type: 'text', text: JSON.stringify(comments) }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'getProjectComments',
    description: 'Get a list of comments for a specific project in Todoist',
    parameters: z.object({
      projectId: z.string().describe('Project ID for filtering'),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);

      try {
        const comments = await api.getComments(args);
        return {
          content: [{ type: 'text', text: JSON.stringify(comments) }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'createTaskComment',
    description: 'Create a new comment for a task in Todoist',
    parameters: z.object({
      content: z.string().describe('Comment text'),
      taskId: z.string().describe('Task ID'),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);

      try {
        const comment = await api.addComment(args);
        return {
          content: [{ type: 'text', text: JSON.stringify(comment) }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'createProjectComment',
    description: 'Create a new comment for a project in Todoist',
    parameters: z.object({
      content: z.string().describe('Comment text'),
      projectId: z.string().describe('Project ID'),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);

      try {
        const comment = await api.addComment(args);
        return {
          content: [{ type: 'text', text: JSON.stringify(comment) }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'updateComment',
    description: 'Update an existing comment in Todoist',
    parameters: z.object({
      id: z.string().describe('Unique comment identifier'),
      content: z.string().describe('New comment text'),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);

      try {
        const { id, ...updateArgs } = args;
        const comment = await api.updateComment(id, updateArgs);
        return {
          content: [{ type: 'text', text: JSON.stringify(comment) }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'deleteComment',
    description: 'Delete a comment from Todoist',
    parameters: z.object({
      id: z.string().describe('Unique comment identifier to delete'),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);

      try {
        await api.deleteComment(args.id);
        return {
          content: [{ type: 'text', text: 'Comment deleted successfully' }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'getComment',
    description: 'Get information about a specific comment by its ID',
    parameters: z.object({
      id: z.string().describe('Unique comment identifier'),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);

      try {
        const comment = await api.getComment(args.id);
        return {
          content: [{ type: 'text', text: JSON.stringify(comment) }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });
}
