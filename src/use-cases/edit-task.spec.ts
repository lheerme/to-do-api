import { beforeEach, describe, expect, it } from 'vitest'
import {
  InMemoryTaskRepository,
  type InMemoryTaskRepositoryReturn,
} from '../repositories/in-memory/in-memory-task-repository.ts'
import { EditTask, type EditTaskReturn } from './edit-task.ts'
import { ResourceNotFoundError } from './errors/resource-not-found-error.ts'
import { TaskAlreadyExistsError } from './errors/task-already-exists-error.ts'

let taskRepository: InMemoryTaskRepositoryReturn
let sut: EditTaskReturn

describe('Edit task use case', () => {
  beforeEach(async () => {
    taskRepository = InMemoryTaskRepository()
    sut = EditTask(taskRepository)

    await taskRepository.createTask({
      id: 'task-01',
      title: 'title-01',
      is_completed: false,
      todo_id: 'todo-01',
      user_id: 'user-01',
    })
  })

  it('should be able to edit task', async () => {
    const { task } = await sut.execute({
      id: 'task-01',
      title: 'title-new',
      todo_id: 'todo-01',
    })

    expect(task.title).toBe('title-new')
  })

  it('should not be able to edit an inexistent task', async () => {
    await expect(async () => {
      await sut.execute({
        id: 'task-02',
        title: 'title-new',
        todo_id: 'todo-02',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit a task with a title that already exists', async () => {
    await expect(async () => {
      await sut.execute({
        id: 'task-01',
        title: 'title-01',
        todo_id: 'todo-01',
      })
    }).rejects.toBeInstanceOf(TaskAlreadyExistsError)
  })
})
