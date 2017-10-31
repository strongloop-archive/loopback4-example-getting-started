import { post, param, get, put, patch, del, HttpErrors } from '@loopback/rest';
import { TodoSchema, Todo, TodoItem } from '../models';
import { repository, EntityCrudRepository } from '@loopback/repository';

export class TodoController {
  constructor(
    @repository('todo') protected todoRepo: EntityCrudRepository<Todo, number>,
    @repository('todo-item')
    protected todoItemRepo: EntityCrudRepository<TodoItem, number>
  ) {}
  @post('/todo')
  @param.body('todo', TodoSchema)
  async createTodo(todo: Todo) {
    if (!todo.title) {
      return Promise.reject(new HttpErrors.BadRequest('title is required'));
    }
    if (todo.checklist) {
      return Promise.reject(
        new HttpErrors.BadRequest(
          'checklist may not be submitted as part of the todo request'
        )
      );
    }
    const result = await this.todoRepo.create(todo);
    return result;
  }

  @get('/todo/{id}')
  @param.path.number('id')
  @param.query.boolean('items')
  async findTodoById(id: number, items?: boolean): Promise<Todo> {
    let todo;
    try {
      todo = await this.todoRepo.findById(id);
    } catch (err) {
      return Promise.reject(
        new HttpErrors.NotFound(`No todo with id "${id}" was found.`)
      );
    }
    if (todo && items) {
      todo.checklist = await this.todoItemRepo.find({
        where: {
          todoId: todo.id
        }
      });
    }
    return todo;
  }

  @get('/todo')
  async find(): Promise<Todo[]> {
    return await this.todoRepo.find();
  }

  @put('/todo/{id}')
  @param.path.number('id')
  @param.body('todo', TodoSchema)
  async replaceTodo(id: number, todo: Todo): Promise<boolean> {
    return await this.todoRepo.replaceById(id, todo);
  }

  @patch('/todo/{id}')
  @param.path.number('id')
  @param.body('todo', TodoSchema)
  async updateTodo(id: number, todo: Todo): Promise<boolean> {
    try {
      await this.todoRepo.findById(id);
      return await this.todoRepo.updateById(id, todo);
    } catch (err) {
      return Promise.reject(
        new HttpErrors.NotFound(`No todo with id "${id}" was found.`)
      );
    }
  }

  @del('/todo/{id}')
  @param.path.number('id')
  async deleteTodo(id: number): Promise<boolean> {
    const result = await this.todoRepo.deleteById(id);
    if (result) {
      return Promise.resolve(result);
    } else {
      return Promise.reject(
        new HttpErrors.NotFound(`No todo with id "${id}" was found.`)
      );
    }
  }
}
