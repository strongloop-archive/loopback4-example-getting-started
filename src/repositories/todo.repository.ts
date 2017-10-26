import { DefaultCrudRepository, DataSourceType } from '@loopback/repository';
import { Todo } from '../models';
import { inject } from '@loopback/core';

export class TodoRepository extends DefaultCrudRepository<
  Todo,
  typeof Todo.prototype.id
> {
  constructor(@inject('datasource') protected datasource: DataSourceType) {
    super(Todo, datasource);
  }
}
