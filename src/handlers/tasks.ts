import {
  AddTaskArgs,
  GetTasksArgs,
  UpdateTaskArgs,
} from '@doist/todoist-api-typescript';
import { z } from 'zod';
import { UserError } from 'fastmcp';

import { TodoistMCP, TodoistApiResolver } from '../types';

export function setupTaskHandlers(
  server: TodoistMCP,
  resolveApi: TodoistApiResolver
): void {
  server.addTool({
    name: 'getTasks',
    description:
      'Getting a list of tasks in Todoist with basic filtering by project, section, label, and other parameters',
    parameters: z.object({
      projectId: z
        .string()
        .optional()
        .describe("Project ID for filtering (example: '2207306141')"),
      sectionId: z
        .string()
        .optional()
        .describe("Section ID for filtering (example: '7025')"),
      label: z
        .string()
        .optional()
        .describe("Label name for filtering (example: 'important')"),
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

  server.addTool({
    name: 'createTask',
    description: 'Create a new task in Todoist',
    parameters: z.object({
      content: z.string().describe('Task text (required)'),
      description: z
        .string()
        .optional()
        .describe('Detailed text description of the task'),
      projectId: z
        .string()
        .optional()
        .describe(
          "Project ID where the task is being created (example: '2207306141')"
        ),
      sectionId: z
        .string()
        .optional()
        .describe("Section ID in the project (example: '7025')"),
      parentId: z
        .string()
        .optional()
        .describe('Parent task ID (for creating a subtask)'),
      order: z.number().optional().describe('Task order in the list (integer)'),
      labels: z
        .array(z.string())
        .optional()
        .describe("Array of label names (example: ['work', 'urgent'])"),
      priority: z
        .number()
        .min(1)
        .max(4)
        .optional()
        .describe('Task priority: 4 (highest) - 1 (lowest)'),
      dueString: z
        .string()
        .optional()
        .describe(
          "Due date in text format (example: 'tomorrow at 3pm', 'every Monday')"
        ),
      dueDate: z
        .string()
        .optional()
        .describe("Due date in YYYY-MM-DD format (example: '2024-03-20')"),
      dueDatetime: z
        .string()
        .optional()
        .describe(
          "Due date in ISO 8601 format (example: '2024-03-20T15:00:00Z')"
        ),
      dueLang: z
        .string()
        .optional()
        .describe("Language for processing dueString (example: 'ru', 'en')"),
      assigneeId: z
        .string()
        .optional()
        .describe('ID of the user to whom the task is assigned'),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        const task = await api.addTask(args as AddTaskArgs);
        return {
          content: [{ type: 'text', text: JSON.stringify(task) }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'updateTask',
    description: 'Update an existing task in Todoist',
    parameters: z.object({
      id: z.string().describe("Unique task identifier (example: '7025')"),
      content: z.string().optional().describe('New task text'),
      description: z.string().optional().describe('New task description'),
      projectId: z
        .string()
        .optional()
        .describe("New project ID (example: '2207306141')"),
      sectionId: z
        .string()
        .optional()
        .describe("New section ID (example: '7025')"),
      parentId: z.string().optional().describe('New parent task ID'),
      order: z
        .number()
        .optional()
        .describe('New task order in the list (integer)'),
      labels: z
        .array(z.string())
        .optional()
        .describe("New array of label names (example: ['work', 'urgent'])"),
      priority: z
        .number()
        .min(1)
        .max(4)
        .optional()
        .describe('New task priority: 4 (highest) - 1 (lowest)'),
      dueString: z
        .string()
        .optional()
        .describe("New due date in text format (example: 'tomorrow at 3pm')"),
      dueDate: z
        .string()
        .optional()
        .describe("New due date in YYYY-MM-DD format (example: '2024-03-20')"),
      dueDatetime: z
        .string()
        .optional()
        .describe(
          "New due date in ISO 8601 format (example: '2024-03-20T15:00:00Z')"
        ),
      dueLang: z
        .string()
        .optional()
        .describe(
          "New language for processing dueString (example: 'ru', 'en')"
        ),
      assigneeId: z.string().optional().describe('New assignee ID'),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        const { id, ...updateArgs } = args;
        const task = await api.updateTask(id, updateArgs as UpdateTaskArgs);
        return {
          content: [{ type: 'text', text: JSON.stringify(task) }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'deleteTask',
    description: 'Delete a task from Todoist',
    parameters: z.object({
      id: z
        .string()
        .describe("Unique task identifier to delete (example: '7025')"),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        await api.deleteTask(args.id);
        return {
          content: [{ type: 'text', text: 'Task deleted successfully' }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'getTask',
    description: 'Get information about a specific task by its ID',
    parameters: z.object({
      id: z.string().describe("Unique task identifier (example: '7025')"),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        const task = await api.getTask(args.id);
        return {
          content: [{ type: 'text', text: JSON.stringify(task) }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'closeTask',
    description: 'Mark a task as completed in Todoist',
    parameters: z.object({
      id: z
        .string()
        .describe("Unique task identifier to close (example: '7025')"),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        await api.closeTask(args.id);
        return {
          content: [{ type: 'text', text: 'Task closed successfully' }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'reopenTask',
    description: 'Reopen a previously completed task in Todoist',
    parameters: z.object({
      id: z
        .string()
        .describe("Unique task identifier to reopen (example: '7025')"),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        await api.reopenTask(args.id);
        return {
          content: [{ type: 'text', text: 'Task reopened successfully' }],
        };
      } catch (error) {
        throw new UserError(
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    },
  });

  server.addTool({
    name: 'getTasksByFilter',
    description:
      'Getting a list of tasks in Todoist by query filter. Supports complex filtering conditions.',
    parameters: z.object({
      filter: z
        .string()
        .describe(
          "Filter string in Todoist format (example: 'today & @important', 'overdue | today')"
        ),
      projectId: z
        .string()
        .optional()
        .describe(
          "Project ID for additional filtering (example: '2207306141')"
        ),
      sectionId: z
        .string()
        .optional()
        .describe("Section ID for additional filtering (example: '7025')"),
      label: z
        .string()
        .optional()
        .describe("Label name for additional filtering (example: 'important')"),
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
