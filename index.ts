import { TodoApplication } from './src/application';

const app = new TodoApplication();

app.start().catch(err => {
  console.error(`Unable to start application: ${err}`);
});
