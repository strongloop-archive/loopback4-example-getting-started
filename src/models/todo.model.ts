import {Entity, property, model} from '@loopback/repository';
import {SchemaObject} from '@loopback/openapi-spec';

@model()
export class Todo extends Entity {
  @property({
    type: 'number',
    id: true
  })
  id?: number;

  @property({
    type: 'string',
    required: true
  })
  title: string;

  @property({
    type: 'string'
  })
  desc?: string;

  @property({
    type: 'boolean'
  })
  isComplete: boolean;

  getId() {
    return this.id;
  }
}

export const TodoSchema: SchemaObject = {
  title: 'todoItem',
  properties: {
    id: {
      type: 'number',
      description: 'ID number of the Todo entry.'
    },
    title: {
      type: 'string',
      description: 'Title of the Todo entry.'
    },
    desc: {
      type: 'number',
      description: 'ID number of the Todo entry.'
    },
    isComplete: {
      type: 'boolean',
      description: 'Whether or not the Todo entry is complete.'
    }
  }
};
