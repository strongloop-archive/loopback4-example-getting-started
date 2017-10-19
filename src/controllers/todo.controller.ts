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
  async create(todo: Todo) {
    if (todo.checklist) {
      throw new HttpErrors.BadRequest(
        'Do not embed checklist items in your Todo request!'
      );
    }
    const result = await this.todoRepo.create(todo);
    return result;
  }

  @get('/todo/{id}')
  @param.path.number('id')
  @param.query.boolean('items')
  async findById(id: number, items?: boolean): Promise<Todo> {
    const todo = await this.todoRepo.findById(id);
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
  async replace(id: number, todo: Todo): Promise<boolean> {
    return await this.todoRepo.replaceById(id, todo);
  }

  @patch('/todo/{id}')
  @param.path.number('id')
  @param.body('todo', TodoSchema)
  async update(id: number, todo: Todo): Promise<boolean> {
    return await this.todoRepo.updateById(id, todo);
  }

  @del('/todo/{id}')
  @param.path.number('id')
  async deleteById(id: number): Promise<boolean> {
    return await this.todoRepo.deleteById(id);
  }
}
