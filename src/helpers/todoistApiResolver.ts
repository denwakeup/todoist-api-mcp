import { TodoistApi } from '@doist/todoist-api-typescript';
import { UserError } from 'fastmcp';

import { TodoistApiResolver } from '../types';

export const todoistApiResolver: TodoistApiResolver = (session) => {
  if (!session?.apiToken) {
    throw new UserError('No todoist api token provided');
  }

  return new TodoistApi(session.apiToken);
};
