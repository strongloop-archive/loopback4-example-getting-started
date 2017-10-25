import { Entity, property, model } from '@loopback/repository';
import { SchemaObject } from '@loopback/openapi-spec';

@model()
export class TodoItem extends Entity {
  @property({
    type: 'number',
    id: true
  })
  id: number;

  @property({
    type: 'string'
  })
  title: string;

  @property({
    type: 'boolean'
  })
  isComplete: boolean;

  @property({
    type: 'number'
  })
  todoId: number;

  getId() {
    return this.id;
  }
}

export const TodoItemSchema: SchemaObject = {
  title: 'todoItem',
  properties: {
    id: {
      type: 'number',
      description: 'ID number of the Todo entry.'
    },
    todoId: {
      type: 'number',
      description: 'The id of the parent Todo'
    },
    title: {
      type: 'string',
      description: 'Title of the Todo entry.'
    },
    isComplete: {
      type: 'boolean',
      description: 'Whether or not the Todo entry is complete.'
    }
  }
};
