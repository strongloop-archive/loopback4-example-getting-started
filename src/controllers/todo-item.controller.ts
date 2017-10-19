import { repository, EntityCrudRepository } from '@loopback/repository';
import { TodoItem, TodoItemSchema } from '../models/index';
import { get, put, param, patch, post, del } from '@loopback/rest';

export class TodoItemController {
  constructor(
    @repository('todo-item')
    public todoItemRepo: EntityCrudRepository<TodoItem, number>
  ) {}
  @get('/todo/{id}/items')
  async getTodoItems(id: number) {
    return await this.todoItemRepo.find({
      where: {
        todoId: id
      }
    });
  }

  @post('/todo/{id}/items')
  @param.path.number('id')
  @param.body('todoItem', TodoItemSchema)
  async createTodoItem(id: number, todoItem: TodoItem) {
    todoItem.todoId = id;
    return await this.todoItemRepo.create(todoItem);
  }

  @put('/todo/{x}/items/{id}')
  @put('/todoitem/{id}')
  @param.path.number('id')
  @param.body('todoItem', TodoItemSchema)
  @param.path.number('x')
  async replaceTodoItem(id: number, item: TodoItem, x?: number) {
    return (await this.todoItemRepo.replaceById(id, item)).toString();
  }

  @patch('/todo/{x}/items/{id}')
  @patch('/todoitem/{id}')
  @param.path.number('id')
  @param.body('todoItem', TodoItemSchema)
  @param.path.number('x')
  async updateTodoItem(id: number, todoItem: TodoItem, x?: number) {
    // We don't need the todoId, but it's for consistency.
    return (await this.todoItemRepo.updateById(id, todoItem)).toString();
  }

  @del('/todo/{x}/items/{id}')
  @param.path.number('id')
  async deleteTodoItem(id: number) {
    return (await this.todoItemRepo.deleteById(id)).toString();
  }

  @del('/todo/{id}/items')
  @param.path.number('id')
  async deleteAll(id: number) {
    return (await this.todoItemRepo.deleteAll({
      todoId: id
    })).toString();
  }
}
