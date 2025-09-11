import { beforeEach, describe, expect, it } from 'vitest'
import {
  InMemoryTaskRepository,
  type InMemoryTaskRepositoryReturn,
} from '../repositories/in-memory/in-memory-task-repository.ts'
import { DeleteTask, type DeleteTaskReturn } from './delete-task.ts'
import { ResourceNotFoundError } from './errors/resource-not-found-error.ts'

let taskRepository: InMemoryTaskRepositoryReturn
let sut: DeleteTaskReturn

describe('Delete task use case', () => {
  beforeEach(async () => {
    taskRepository = InMemoryTaskRepository()
    sut = DeleteTask(taskRepository)

    await taskRepository.createTask({
      id: 'id-01',
      title: 'title-01',
      is_completed: false,
      todo_id: 'todo-01',
      user_id: 'user-01',
    })
  })

  it('should be able to delete task', async () => {
    await sut.execute({ id: 'id-01', userId: 'user-01' })

    await expect(async () => {
      await sut.execute({ id: 'id-01', userId: 'user-01' })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete a inexistent task', async () => {
    await expect(async () => {
      await sut.execute({ id: 'id-02', userId: 'user-01' })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete a task from another user', async () => {
    await expect(async () => {
      await sut.execute({ id: 'id-01', userId: 'user-02' })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
