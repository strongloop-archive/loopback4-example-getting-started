import { Application } from '@loopback/core';
import { RestComponent, RestServer } from '@loopback/rest';
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
  constructor() {
    super({
      components: [RestComponent]
    });
  }

  async start() {
    const server = await this.getServer(RestServer);
    this.setupRepositories(server);
    this.setupControllers(server);
    await super.start(); // This starts all servers registered with the app.
    console.log(`Server is running on port ${await server.get('rest.port')}`);
  }

  // Helper functions (just to keep things organized)
  setupRepositories(server: RestServer) {
    const dsConfigPath = path.resolve('config', 'datasources.json');
    const def = JSON.parse(fs.readFileSync(dsConfigPath, 'utf8')).ds;

    const ds: juggler.DataSource = new DataSourceConstructor('ds', def);

    const todoRepo = new DefaultCrudRepository(Todo, ds);
    const todoItemRepo = new DefaultCrudRepository(TodoItem, ds);
    server.bind('repositories.todo').to(todoRepo);
    server.bind('repositories.todo-item').to(todoItemRepo);
  }

  setupControllers(server: RestServer) {
    server.controller(TodoController);
    server.controller(TodoItemController);
  }
}
