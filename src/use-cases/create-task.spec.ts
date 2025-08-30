import { beforeEach, describe, expect, it } from 'vitest'
import {
  InMemoryTaskRepository,
  type InMemoryTaskRepositoryReturn,
} from '../repositories/in-memory/in-memory-task-repository.ts'
import { CreateTask, type CreateTaskReturn } from './create-task.ts'
import { TaskAlreadyExistsError } from './errors/task-already-exists-error.ts'

let taskRepository: InMemoryTaskRepositoryReturn
let sut: CreateTaskReturn

describe('Create task use case', () => {
  beforeEach(() => {
    taskRepository = InMemoryTaskRepository()
    sut = CreateTask(taskRepository)
  })

  it('should be able to create task', async () => {
    const { task } = await sut.execute({
      title: 'task-title',
      todo_id: 'todo-01',
      user_id: 'user-01',
    })

    expect(task.id).toEqual(expect.any(String))
  })

  it('should not be able to create a task with same name twice for the same to-do list', async () => {
    const title = 'task-title'
    const todo_id = 'todo-01'
    const user_id = 'user-01'

    await sut.execute({
      title,
      todo_id,
      user_id,
    })

    await expect(async () => {
      await sut.execute({
        title,
        todo_id,
        user_id,
      })
    }).rejects.toBeInstanceOf(TaskAlreadyExistsError)
  })

  it('should be able to create a task with same name twice for different to-dos', async () => {
    const title = 'task-title'
    const user_id = 'user-01'

    await sut.execute({
      title,
      todo_id: 'todo-01',
      user_id,
    })

    const { task } = await sut.execute({
      title,
      todo_id: 'todo-02',
      user_id,
    })

    expect(task.id).toEqual(expect.any(String))
  })
})
