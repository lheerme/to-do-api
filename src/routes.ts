import z from 'zod'
import { createTask } from './controllers/tasks/create-task.ts'
import { deleteTask } from './controllers/tasks/delete-task.ts'
import { editTask } from './controllers/tasks/edit-task.ts'
import { toggleTaskCompletion } from './controllers/tasks/toggle-task-completion.ts'
import { createTodo } from './controllers/todos/create-todo.ts'
import { deleteTodo } from './controllers/todos/delete-todo.ts'
import { editTodo } from './controllers/todos/edit-todo.ts'
import { getTodo } from './controllers/todos/get-todo.ts'
import { authenticateUser } from './controllers/users/authenticate-user.ts'
import { createUser } from './controllers/users/create-user.ts'
import { getUser } from './controllers/users/get-user.ts'
import { getUserTodos } from './controllers/users/get-user-todos.ts'
import { refresh } from './controllers/users/refresh.ts'
import { verifyJWT } from './middlewares/verify-jwt.ts'
import { authenticateUserSchema } from './schemas/authenticate-user-schema.ts'
import { createTaskSchema } from './schemas/create-task-schema.ts'
import { createTodoSchema } from './schemas/create-todo-schema.ts'
import { createUserSchema } from './schemas/create-user-schema.ts'
import { editTaskSchema } from './schemas/edit-task-schema.ts'
import { editTodoSchema } from './schemas/edit-todo-schema.ts'
import { toggleTaskCompletionSchema } from './schemas/toggle-task-completion-schema.ts'
import type { FastifyTypedInstance } from './types.ts'

export function routes(app: FastifyTypedInstance) {
  // user
  app.post(
    '/users',
    {
      schema: {
        description: 'Create a new user',
        tags: ['user'],
        body: createUserSchema,
        response: {
          201: z.null().describe('User created'),
          409: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('User already exists'),
          500: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('Internal Error'),
        },
      },
    },
    createUser
  )
  app.post(
    '/sessions',
    {
      schema: {
        description: 'Authenticate user',
        tags: ['auth'],
        body: authenticateUserSchema,
        response: {
          200: z
            .object({
              token: z.string().default('Access token'),
            })
            .describe('User authenticated'),
          400: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('Invalid credentials'),
          500: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('Internal Error'),
        },
      },
    },
    authenticateUser
  )
  app.patch(
    '/token/refresh',
    {
      schema: {
        description: 'Update access token with refresh token',
        tags: ['auth'],
        response: {
          200: z
            .object({
              accessToken: z.string().default('Access token'),
            })
            .describe('Access token generated'),
          401: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('Invalid refresh token'),
          500: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('Internal Error'),
        },
      },
    },
    refresh
  )
  app.get(
    '/user',
    {
      onRequest: [verifyJWT],
      schema: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        description: 'Get user data',
        tags: ['user'],
        response: {
          200: z
            .object({
              data: z.object({
                id: z.uuid(),
                first_name: z.string().default('Michael'),
                last_name: z.string().default('Scott'),
                email: z.email().default('ihatetoby@gmail.com'),
                created_at: z.date(),
              }),
            })
            .describe('User returned'),
          401: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('Unauthorized'),
          500: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('Internal Error'),
        },
      },
    },
    getUser
  )

  // to-dos
  app.post(
    '/todos',
    {
      onRequest: [verifyJWT],
      schema: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        description: 'Create new to-do',
        tags: ['todo'],
        body: createTodoSchema,
        response: {
          201: z
            .object({
              data: z.object({
                id: z.uuid(),
                title: z.string().default('Groceries'),
                created_at: z.date(),
                user_id: z.uuid(),
              }),
            })
            .describe('To-do created'),
          409: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('To-do already exists'),
          500: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('Internal Error'),
        },
      },
    },
    createTodo
  )
  app.put(
    '/todos/:id',
    {
      onRequest: [verifyJWT],
      schema: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        description: 'Edit to-do',
        tags: ['todo'],
        body: editTodoSchema,
        response: {
          200: z
            .object({
              data: z.object({
                id: z.uuid(),
                title: z.string().default('Groceries'),
                created_at: z.date(),
                user_id: z.uuid(),
              }),
            })
            .describe('To-do edited'),
          404: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('To-do not found'),
          409: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('To-do already exists'),
          500: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('Internal Error'),
        },
      },
    },
    editTodo
  )
  app.delete(
    '/todos/:id',
    {
      onRequest: [verifyJWT],
      schema: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        description: 'Delete to-do',
        tags: ['todo'],
        response: {
          204: z.null().describe('To-do deleted'),
          404: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('To-do not found'),
          500: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('Internal Error'),
        },
      },
    },
    deleteTodo
  )
  app.get(
    '/todos',
    {
      onRequest: [verifyJWT],
      schema: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        description: 'Get user to-dos',
        tags: ['todo'],
        response: {
          200: z
            .object({
              data: z.object({
                id: z.uuid(),
                title: z.string().default('Groceries'),
                created_at: z.date(),
                user_id: z.uuid(),
              }),
            })
            .describe('To-dos returned'),
          500: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('Internal Error'),
        },
      },
    },
    getUserTodos
  )
  app.get(
    '/todos/:id',
    {
      onRequest: [verifyJWT],
      schema: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        description: 'Get to-do details',
        tags: ['todo'],
        response: {
          200: z
            .object({
              data: z.object({
                id: z.uuid(),
                title: z.string().default('Groceries'),
                created_at: z.date(),
                user_id: z.uuid(),
                tasks: z.array(
                  z.object({
                    id: z.uuid(),
                    title: z.string().default('Coffee'),
                    created_at: z.date(),
                    is_completed: z.boolean(),
                    todo_id: z.uuid(),
                    user_id: z.uuid(),
                  })
                ),
              }),
            })
            .describe('To-do returned'),
          404: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('To-do not found'),
          500: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('Internal Error'),
        },
      },
    },
    getTodo
  )

  // tasks
  app.post(
    '/todos/:id',
    {
      onRequest: [verifyJWT],
      schema: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        description: 'Create task',
        tags: ['task'],
        body: createTaskSchema,
        response: {
          201: z.object({
            data: z
              .object({
                id: z.uuid(),
                title: z.string().default('Coffee'),
                created_at: z.date(),
                is_completed: z.boolean(),
                todo_id: z.uuid(),
                user_id: z.uuid(),
              })
              .describe('Task created'),
          }),
          409: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('Task already exists'),
          500: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('Internal Error'),
        },
      },
    },
    createTask
  )
  app.put(
    '/todos/:todoId/tasks/:taskId',
    {
      onRequest: [verifyJWT],
      schema: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        description: 'Edit task',
        tags: ['task'],
        body: editTaskSchema,
        response: {
          201: z.object({
            data: z
              .object({
                id: z.uuid(),
                title: z.string().default('Coffee'),
                created_at: z.date(),
                is_completed: z.boolean(),
                todo_id: z.uuid(),
                user_id: z.uuid(),
              })
              .describe('Task edited'),
          }),
          404: z.object({
            message: z
              .string()
              .default('Error message')
              .describe('Task not found'),
          }),
          409: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('Task already exists'),
          500: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('Internal Error'),
        },
      },
    },
    editTask
  )
  app.delete(
    '/todos/:todoId/tasks/:taskId',
    {
      onRequest: [verifyJWT],
      schema: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        description: 'Delete task',
        tags: ['task'],
        response: {
          204: z.null().describe('Task deleted'),
          404: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('Task not found'),
          500: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('Internal Error'),
        },
      },
    },
    deleteTask
  )
  app.patch(
    '/todos/:todoId/tasks/:taskId',
    {
      onRequest: [verifyJWT],
      schema: {
        security: [
          {
            bearerAuth: [],
          },
        ],
        description: 'Toggle task completion',
        tags: ['task'],
        body: toggleTaskCompletionSchema,
        response: {
          200: z.object({
            data: z
              .object({
                id: z.uuid(),
                title: z.string().default('Coffee'),
                created_at: z.date(),
                is_completed: z.boolean(),
                todo_id: z.uuid(),
                user_id: z.uuid(),
              })
              .describe('Task completion modified'),
          }),
          404: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('Task not found'),
          500: z
            .object({
              message: z.string().default('Error message'),
            })
            .describe('Internal Error'),
        },
      },
    },
    toggleTaskCompletion
  )
}
