import { Application, ApplicationConfig } from '@loopback/core';
import { RestComponent } from '@loopback/rest';
import { TodoController } from './controllers';
import { TodoRepository } from './repositories';
import { db } from './datasources/db.datasource';
import { DataSourceConstructor, RepositoryMixin } from '@loopback/repository';

export class TodoApplication extends RepositoryMixin(Application) {
  constructor(options?: ApplicationConfig) {
    // TODO(bajtos) The comment below does not make sense to me.
    // Consumers of TodoApplication object should not be changing the shape
    // of the app (what components are mounted, etc.) The config object should
    // be used only to configure what ports the app is listening on,
    // which database to connect to, etc.

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
    // TODO(bajtos) Automate datasource and repo registration via @loopback/boot
    const datasource =
      this.options && this.options.datasource
        ? new DataSourceConstructor(this.options.datasource)
        : db;
    // TODO(bajtos) use app.dataSource() from @loopback/repository mixin
    // (app.dataSource() is not implemented there yet)
    this.bind('datasource').to(datasource);
    this.repository(TodoRepository);
  }

  setupControllers() {
    // TODO(bajtos) Automate controller registration via @loopback/boot
    this.controller(TodoController);
  }
}
