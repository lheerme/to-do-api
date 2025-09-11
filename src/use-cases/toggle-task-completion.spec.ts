import { beforeEach, describe, expect, it } from 'vitest'
import {
  InMemoryTaskRepository,
  type InMemoryTaskRepositoryReturn,
} from '../repositories/in-memory/in-memory-task-repository.ts'
import { ResourceNotFoundError } from './errors/resource-not-found-error.ts'
import {
  ToggleTaskCompletion,
  type ToggleTaskCompletionReturn,
} from './toggle-task-completion.ts'

let taskRepository: InMemoryTaskRepositoryReturn
let sut: ToggleTaskCompletionReturn

describe('Toggle task completion use cause', () => {
  beforeEach(async () => {
    taskRepository = InMemoryTaskRepository()
    sut = ToggleTaskCompletion(taskRepository)

    await taskRepository.createTask({
      id: 'task-01',
      title: 'title-01',
      is_completed: false,
      todo_id: 'todo-01',
      user_id: 'user-01',
    })
  })

  it('should be able to toggle task completion', async () => {
    const { task } = await sut.execute({
      id: 'task-01',
      user_id: 'user-01',
      is_completed: true,
    })

    expect(task.is_completed).toBe(true)
  })

  it('should not be able to toggle task completion of an inexistent task', async () => {
    await expect(async () => {
      await sut.execute({
        id: 'task-02',
        user_id: 'user-01',
        is_completed: true,
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
