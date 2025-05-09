import { z } from 'zod';
import { UserError } from 'fastmcp';
import { Duration, MoveTaskArgs } from '@doist/todoist-api-typescript';
import { RequireAllOrNone, RequireOneOrNone } from 'type-fest';

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
        .nullable()
        .describe("Project ID for filtering (example: '2207306141')"),
      sectionId: z
        .string()
        .optional()
        .nullable()
        .describe("Section ID for filtering (example: '7025')"),
      label: z
        .string()
        .optional()
        .nullable()
        .describe("Label name for filtering (example: 'important')"),
      ids: z
        .array(z.string())
        .optional()
        .nullable()
        .describe(
          "Array of task IDs to retrieve specific tasks (example: ['123', '456'])"
        ),
      parentId: z
        .string()
        .optional()
        .nullable()
        .describe("Parent task ID to retrieve subtasks (example: '7025')"),
      cursor: z
        .string()
        .nullable()
        .optional()
        .describe('Cursor for pagination (obtained from previous request)'),
      limit: z
        .number()
        .optional()
        .nullable()
        .describe('Limit on the number of tasks (default: 30, maximum: 50)'),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        const tasks = await api.getTasks({
          ...args,
          projectId: args.projectId ?? undefined,
          sectionId: args.sectionId ?? undefined,
          label: args.label ?? undefined,
          ids: args.ids ?? undefined,
          parentId: args.parentId ?? undefined,
          limit: args.limit ?? undefined,
        });
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
        .nullable()
        .describe('Detailed text description of the task'),
      projectId: z
        .string()
        .optional()
        .nullable()
        .describe(
          "Project ID where the task is being created (example: '2207306141')"
        ),
      sectionId: z
        .string()
        .optional()
        .nullable()
        .describe("Section ID in the project (example: '7025')"),
      parentId: z
        .string()
        .optional()
        .nullable()
        .describe('Parent task ID (for creating a subtask)'),
      order: z
        .number()
        .optional()
        .nullable()
        .describe('Task order in the list (integer)'),
      labels: z
        .array(z.string())
        .optional()
        .nullable()
        .describe("Array of label names (example: ['work', 'urgent'])"),
      priority: z
        .number()
        .min(1)
        .max(4)
        .optional()
        .nullable()
        .describe('Task priority: 4 (highest) - 1 (lowest)'),
      dueString: z
        .string()
        .optional()
        .nullable()
        .describe(
          "Due date in text format (example: 'tomorrow at 3pm', 'every Monday')"
        ),
      dueDate: z
        .string()
        .optional()
        .nullable()
        .describe("Due date in YYYY-MM-DD format (example: '2024-03-20')"),
      dueDatetime: z
        .string()
        .optional()
        .nullable()
        .describe(
          "Due date in ISO 8601 format (example: '2024-03-20T15:00:00Z')"
        ),
      dueLang: z
        .string()
        .optional()
        .nullable()
        .describe("Language for processing dueString (example: 'ru', 'en')"),
      deadlineLang: z
        .string()
        .optional()
        .nullable()
        .describe("Language for processing deadlineDate (example: 'ru', 'en')"),
      deadlineDate: z
        .string()
        .optional()
        .nullable()
        .describe("Deadline date in YYYY-MM-DD format (example: '2024-03-20')"),
      duration: z
        .number()
        .optional()
        .nullable()
        .describe(
          'Duration amount (must be specified together with durationUnit)'
        ),
      durationUnit: z
        .enum(['minute', 'day'])
        .optional()
        .nullable()
        .describe('Duration unit (must be specified together with duration)'),
      assigneeId: z
        .string()
        .optional()
        .nullable()
        .describe('ID of the user to whom the task is assigned'),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        const { durationUnit, dueDate, dueDatetime, duration, ...passedArgs } =
          args;

        const unitArgs = {
          dueDate: dueDate ?? undefined,
          dueDatetime: dueDatetime ?? undefined,
          duration: duration ?? undefined,
          durationUnit: durationUnit ?? undefined,
        } as RequireOneOrNone<{
          dueDate?: string;
          dueDatetime?: string;
        }> &
          RequireAllOrNone<{
            duration?: Duration['amount'];
            durationUnit?: Duration['unit'];
          }>;

        const task = await api.addTask({
          ...passedArgs,
          ...unitArgs,
          description: passedArgs.description ?? undefined,
          projectId: passedArgs.projectId ?? undefined,
          sectionId: passedArgs.sectionId ?? undefined,
          parentId: passedArgs.parentId ?? undefined,
          order: passedArgs.order ?? undefined,
          labels: passedArgs.labels ?? undefined,
          priority: passedArgs.priority ?? undefined,
          assigneeId: passedArgs.assigneeId ?? undefined,
          dueString: passedArgs.dueString ?? undefined,
          dueLang: passedArgs.dueLang ?? undefined,
          deadlineLang: passedArgs.deadlineLang ?? undefined,
          deadlineDate: passedArgs.deadlineDate ?? undefined,
        });
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
      content: z.string().optional().nullable().describe('New task text'),
      description: z
        .string()
        .optional()
        .nullable()
        .describe('New task description'),
      labels: z
        .array(z.string())
        .optional()
        .nullable()
        .describe("New array of label names (example: ['work', 'urgent'])"),
      priority: z
        .number()
        .min(1)
        .max(4)
        .optional()
        .nullable()
        .describe('New task priority: 4 (highest) - 1 (lowest)'),
      dueString: z
        .string()
        .optional()
        .nullable()
        .describe("New due date in text format (example: 'tomorrow at 3pm')"),
      dueDate: z
        .string()
        .optional()
        .nullable()
        .describe("New due date in YYYY-MM-DD format (example: '2024-03-20')"),
      dueDatetime: z
        .string()
        .optional()
        .nullable()
        .describe(
          "New due date in ISO 8601 format (example: '2024-03-20T15:00:00Z')"
        ),
      dueLang: z
        .string()
        .optional()
        .nullable()
        .describe(
          "New language for processing dueString (example: 'ru', 'en')"
        ),
      deadlineLang: z
        .string()
        .optional()
        .nullable()
        .describe(
          "New language for processing deadlineDate (example: 'ru', 'en')"
        ),
      deadlineDate: z
        .string()
        .optional()
        .nullable()
        .describe(
          "New deadline date in YYYY-MM-DD format (example: '2024-03-20')"
        ),
      duration: z
        .number()
        .optional()
        .nullable()
        .describe(
          'New duration amount (must be specified together with durationUnit)'
        ),
      durationUnit: z
        .enum(['minute', 'day'])
        .optional()
        .nullable()
        .describe(
          'New duration unit (must be specified together with duration)'
        ),
      assigneeId: z.string().optional().nullable().describe('New assignee ID'),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        const {
          id,
          durationUnit,
          dueDate,
          dueDatetime,
          duration,
          ...passedArgs
        } = args;

        const unitArgs = {
          dueDate: dueDate ?? undefined,
          dueDatetime: dueDatetime ?? undefined,
          duration: duration ?? undefined,
          durationUnit: durationUnit ?? undefined,
        } as RequireOneOrNone<{
          dueDate?: string;
          dueDatetime?: string;
        }> &
          RequireAllOrNone<{
            duration?: Duration['amount'];
            durationUnit?: Duration['unit'];
          }>;

        const task = await api.updateTask(id, {
          ...passedArgs,
          ...unitArgs,
          content: passedArgs.content ?? undefined,
          description: passedArgs.description ?? undefined,
          labels: passedArgs.labels ?? undefined,
          priority: passedArgs.priority ?? undefined,
          dueString: passedArgs.dueString ?? undefined,
        });
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
      query: z.string().describe(
        `Filter string in Todoist format. Examples:
- 'today & @important' - tasks due today with important label
- 'overdue | today' - overdue or today's tasks
- '#Work & @email' - tasks in Work project with email label
- '(@work | @office) & !subtask' - tasks with work or office label, excluding subtasks
- 'date: tomorrow & !#Work' - tasks due tomorrow, excluding Work project
- '7 days & @waiting' - tasks due in next 7 days with waiting label
- 'assigned to: me & #Work' - tasks assigned to you in Work project
- 'created before: -30 days' - tasks created more than 30 days ago
Use operators: | (OR), & (AND), ! (NOT), () for grouping`
      ),
      lang: z
        .string()
        .optional()
        .nullable()
        .describe("Language for processing query (example: 'ru', 'en')"),
      cursor: z
        .string()
        .nullable()
        .optional()
        .describe('Cursor for pagination (obtained from previous request)'),
      limit: z
        .number()
        .optional()
        .nullable()
        .describe('Limit on the number of tasks (default: 30, maximum: 50)'),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        const tasks = await api.getTasksByFilter({
          ...args,
          lang: args.lang ?? undefined,
          limit: args.limit ?? undefined,
        });
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
    name: 'moveTasks',
    description:
      'Moves tasks to another project, section, or parent task. Exactly one of projectId, sectionId, or parentId must be provided.',
    parameters: z.object({
      ids: z.array(z.string()).describe('Array of task IDs to move'),
      projectId: z.string().optional().nullable().describe('Target project ID'),
      sectionId: z.string().optional().nullable().describe('Target section ID'),
      parentId: z
        .string()
        .optional()
        .nullable()
        .describe('Target parent task ID'),
    }),
    execute: async (args, { session }) => {
      const api = resolveApi(session);
      try {
        const { ids, ...moveArgs } = args;

        const tasks = await api.moveTasks(ids, {
          ...moveArgs,
          parentId: moveArgs.parentId ?? undefined,
          projectId: moveArgs.projectId ?? undefined,
          sectionId: moveArgs.sectionId ?? undefined,
        } as MoveTaskArgs);
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
