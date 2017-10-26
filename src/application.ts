import { Application, ApplicationConfig } from '@loopback/core';
import { RestComponent } from '@loopback/rest';
import { TodoController } from './controllers';
import { TodoRepository } from './repositories';
import { db } from './datasources/db.datasource';
import { DataSourceConstructor } from '@loopback/repository';

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
    let datasource =
      this.options && this.options.datasource
        ? new DataSourceConstructor(this.options.datasource)
        : db;
    this.bind('datasource').to(datasource);
    this.bind('repositories.todo').toClass(TodoRepository);
  }

  setupControllers() {
    this.controller(TodoController);
  }
}
