import { Application } from '@loopback/core';
import { RestComponent, RestServer } from '@loopback/rest';

export class TodoApplication extends Application {
  constructor() {
    super({
      components: [RestComponent]
    });
  }

  async start() {
    const server = await this.getServer(RestServer);
    await super.start(); // This starts all servers registered with the app.
    console.log(`Server is running on port ${await server.get('rest.port')}`);
  }
}