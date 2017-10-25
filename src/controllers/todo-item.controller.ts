import { repository, EntityCrudRepository } from '@loopback/repository';
import { TodoItem, TodoItemSchema, Todo } from '../models/index';
import { get, put, param, patch, post, del, HttpErrors } from '@loopback/rest';

export class TodoItemController {
  constructor(
    @repository('todo-item')
    public todoItemRepo: EntityCrudRepository<TodoItem, number>,
    @repository('todo') public todoRepo: EntityCrudRepository<Todo, number>
  ) {}
  @get('/todo/{id}/items')
  @param.path.number('id')
  async getTodoItems(id: number) {
    return await this.todoItemRepo.find({
      where: {
        todoId: id
      }
    });
  }

  @get('/todo/{x}/items/{id}')
  @param.path.number('x')
  @param.path.number('id')
  async getTodoItem(x: number, id: number) {
    try {
      return await this.todoItemRepo.findById(id);
    } catch (err) {
      return Promise.reject(
        new HttpErrors.NotFound(`No todo item was found with id ${id}`)
      );
    }
  }

  @post('/todo/{id}/items')
  @param.path.number('id')
  @param.body('todoItem', TodoItemSchema)
  async createTodoItem(id: number, todoItem: TodoItem) {
    todoItem.todoId = id;
    let todo;
    try {
      todo = await this.todoRepo.findById(id);
    } catch (err) {
      return Promise.reject(
        new HttpErrors.NotFound(`No todo was found with id ${id}`)
      );
    }
    if (todo) {
      return await this.todoItemRepo.create(todoItem);
    }
  }

  @put('/todo/{x}/items/{id}')
  @put('/todoitem/{id}')
  @param.path.number('id')
  @param.body('todoItem', TodoItemSchema)
  @param.path.number('x')
  async replaceTodoItem(id: number, item: TodoItem, x?: number) {
    return await this.todoItemRepo.replaceById(id, item);
  }

  @patch('/todo/{x}/items/{id}')
  @patch('/todoitem/{id}')
  @param.path.number('x')
  @param.body('todoItem', TodoItemSchema)
  @param.path.number('id')
  async updateTodoItem(x: number, todoItem: TodoItem, id: number) {
    // We don't need the todoId, but it's for consistency.
    let item;
    try {
      item = await this.todoItemRepo.findById(id);
    } catch (err) {
      return Promise.reject(
        new HttpErrors.NotFound(`No todo item was found with id ${id}`)
      );
    }
    return await this.todoItemRepo.updateById(id, todoItem);
  }

  @del('/todo/{x}/items/{id}')
  @param.path.number('x')
  @param.path.number('id')
  async deleteTodoItem(x: number, id: number) {
    let item;
    try {
      item = await this.todoItemRepo.findById(id);
    } catch (err) {
      return Promise.reject(
        new HttpErrors.NotFound(`No todo item was found with id ${id}`)
      );
    }
    return await this.todoItemRepo.deleteById(id);
  }

  @del('/todo/{id}/items')
  @param.path.number('id')
  async deleteAll(id: number) {
    return await this.todoItemRepo.deleteAll({
      todoId: id
    });
  }
}
