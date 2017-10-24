import { Application, ApplicationConfig } from '@loopback/core';
import { RestComponent } from '@loopback/rest';
import * as path from 'path';
import * as fs from 'fs';
import {
  juggler,
  DefaultCrudRepository,
  DataSourceConstructor
} from '@loopback/repository';
import { Todo, TodoItem } from './models/index';
import { TodoController, TodoItemController } from './controllers';

export class TodoApplication extends Application {
  constructor(options?: ApplicationConfig) {
    // Allow options to replace the defined components array, if desired.
    options = Object.assign(
      {},
      {
        components: [RestComponent]
      },
      options
    );
    super(options);
    this.setupRepositories();
    this.setupControllers();
  }

  // Helper functions (just to keep things organized)
  setupRepositories() {
    let def;
    if (this.options && this.options.datasources) {
      def = this.options.datasources.ds;
    } else {
      const dsConfigPath = path.resolve('config', 'datasources.json');
      def = JSON.parse(fs.readFileSync(dsConfigPath, 'utf8')).ds;
    }
    const ds: juggler.DataSource = new DataSourceConstructor('ds', def);

    const todoRepo = new DefaultCrudRepository(Todo, ds);
    const todoItemRepo = new DefaultCrudRepository(TodoItem, ds);
    this.bind('repositories.todo').to(todoRepo);
    this.bind('repositories.todo-item').to(todoItemRepo);
  }

  setupControllers() {
    this.controller(TodoController);
    this.controller(TodoItemController);
  }
}
