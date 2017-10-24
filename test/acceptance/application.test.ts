import { createClientForHandler, supertest, expect } from '@loopback/testlab';
import { RestServer } from '@loopback/rest';
import { TodoApplication } from '../../src/application';

describe('Controllers', () => {
  let app: TodoApplication;
  let server: RestServer;
  let client: supertest.SuperTest<supertest.Test>;

  before(givenAnApplication);
  before(givenARestServer);
  before(async () => {
    await app.start();
  });
  before(() => {
    client = createClientForHandler(server.handleHttp);
  });
  after(async () => {
    await app.stop();
  });
  describe('Todo', () => {
    describe('create', () => {
      const payload = {
        title: 'do a thing',
        desc: 'There are some things that need doing',
        isComplete: false
      };

      it('creates a Todo', async () => {
        await client
          .post('/todo')
          .send(payload)
          .expect(
            Object.assign({}, payload, {
              id: 1
            })
          );
      });
      it('throws if the payload contains a checklist', async () => {
        await client
          .post('/todo')
          .send(
            Object.assign({}, payload, {
              checklist: [
                {
                  title: 'jump the gun'
                }
              ]
            })
          )
          .expect(400);
      });
      it('throws if the payload is missing a title', async () => {
        await client
          .post('/todo')
          .send({})
          .expect(400);
      });

      it('returns 409 if the item already exists', async () => {
        const todo = (await client.post('/todo').send(payload)).body;
        await client
          .post('/todo')
          .send(todo)
          .expect(409);
      });
    });

    describe('findById', () => {
      it('returns a todo if it exists', async () => {
        const item = await client.post('/todo').send({
          title: 'fake'
        });
        await client
          .get(`/todo/${item.body.id}`)
          .send()
          .expect(200);
      });

      it('returns 404 if no match exists', async () => {
        await client
          .get(`/todo/9999999`)
          .send()
          .expect(404);
      });
    });

    describe('find', () => {
      it('finds everything', async () => {
        await client
          .get('/todo')
          .send()
          .expect(200);
      });
    });

    describe('replace', () => {
      it('successfully replaces existing items', async () => {
        const item = await client.post('/todo').send({
          title: 'another one'
        });

        await client
          .put(`/todo/${item.body.id}`)
          .send({
            title: 'another two'
          })
          .expect(200);
      });

      it('returns 404 if no match exists', async () => {
        await client
          .put('/todo/999999')
          .send({
            title: 'another one'
          })
          .expect(404);
      });
    });

    describe('update', () => {
      it('successfully updates existing items', async () => {
        const item = await client.post('/todo').send({
          title: 'another one'
        });

        await client
          .patch(`/todo/${item.body.id}`)
          .send({
            title: 'another two'
          })
          .expect(200);
      });

      it('returns 404 if no match exists', async () => {
        await client
          .patch('/todo/999999')
          .send({
            title: 'another one'
          })
          .expect(404);
      });
    });

    describe('delete', () => {
      it('successfully deletes matching item', async () => {
        await client
          .del('/todo/1')
          .send()
          .expect(200);
      });

      it('returns 404 if no match exists', async () => {
        await client
          .del('/todo/999999')
          .send({
            title: 'another one'
          })
          .expect(404);
      });
    });
  });

  describe('Todo Item', () => {
    const todoBody = {
      title: 'go shopping'
    };
    let todo: any;

    describe('createTodoItem', () => {
      it('successfully creates a todo item', async () => {
        todo = (await client.post('/todo').send(todoBody)).body;
        await client
          .post(`/todo/${todo.id}/items`)
          .send({
            title: 'flux capacitor'
          })
          .expect(200);
      });

      it('returns 404 if no todo exists', async () => {
        await client
          .post('/todo/999999/items')
          .send({
            title: 'flux capacitor'
          })
          .expect(404);
      });

      it('returns 409 if the todo item already exists', async () => {
        const itemPath = `/todo/${todo.id}/items`;
        const todoItem = (await client.post(itemPath).send({
          title: 'flux capacitor'
        })).body;
        await client
          .post(itemPath)
          .send(todoItem)
          .expect(409);
      });
    });
    describe('getTodoItem', () => {
      it('returns a todo item if it exists', async () => {
        const todoItem = (await client.post(`/todo/${todo.id}/items`).send({
          title: 'flux capacitor'
        })).body;
        await client
          .get(`/todo/${todo.id}/items/${todoItem.id}`)
          .send()
          .expect(200, todoItem);
      });

      it('returns 404 if no match exists', async () => {
        await client
          .get(`/todo/${todo.id}/items/999999`)
          .send()
          .expect(404);
      });
    });
    describe('getTodoItems', () => {
      let todo: any;
      let flux: any;
      let plutonium: any;

      before(async () => {
        todo = (await client.post('/todo').send({
          title: 'go shopping'
        })).body;
        // Setup some items
        flux = (await client.post(`/todo/${todo.id}/items`).send({
          title: 'flux capacitor'
        })).body;
        plutonium = (await client.post(`/todo/${todo.id}/items`).send({
          title: 'plutonium'
        })).body;
      });

      it('returns all todo items on a todo', async () => {
        const result = (await client
          .get(`/todo/${todo.id}/items`)
          .send()
          .expect(200)).body;
        expect(result.length).to.eql(2);
        expect(result).to.containEql(flux);
        expect(result).to.containEql(plutonium);
      });
    });
    describe('replaceTodoItem', () => {
      let todo: any;
      let flux: any;
      before(async () => {
        todo = (await client.post('/todo').send({
          title: 'go shopping'
        })).body;
        flux = (await client.post(`/todo/${todo.id}/items`).send({
          title: 'flux capacitor'
        })).body;
      });

      it('successfully replaces a todo item if it exists', async () => {
        await client
          .put(`/todo/${todo.id}/items/${flux.id}`)
          .send({
            title: 'samoflange'
          })
          .expect(200);
      });

      it('returns 404 if a todo item does not exist', async () => {
        await client
          .put(`/todo/${todo.id}/items/999999`)
          .send({
            title: 'whoops'
          })
          .expect(404);
      });
    });
    describe('updateTodoItem', () => {
      let todo: any;
      let flux: any;

      before(async () => {
        todo = (await client.post('/todo').send({
          title: 'go shopping'
        })).body;
        flux = (await client.post(`/todo/${todo.id}/items`).send({
          title: 'flux capacitor'
        })).body;
      });

      it('successfully updates todo item if it exists', async () => {
        const path = `/todo/${todo.id}/items/${flux.id}`;
        await client
          .patch(path)
          .send({
            isComplete: true
          })
          .expect(200);
        await client
          .get(path)
          .send()
          .expect(
            200,
            Object.assign({}, flux, {
              isComplete: true
            })
          );
      });

      it('returns 404 if a todo item does not exist', async () => {
        await client
          .patch(`/todo/${todo.id}/items/999999`)
          .send({
            title: 'whoops'
          })
          .expect(404);
      });
    });
    describe('deleteTodoItem', () => {
      let todo: any;
      let flux: any;
      before(async () => {
        todo = (await client.post('/todo').send({
          title: 'go shopping'
        })).body;
        flux = (await client.post(`/todo/${todo.id}/items`).send({
          title: 'flux capacitor'
        })).body;
      });

      it('deletes an item if it exists', async () => {
        await client
          .del(`/todo/${todo.id}/items/${flux.id}`)
          .send()
          .expect(200);
      });

      it('returns 404 if no match is found', async () => {
        await client
          .del(`/todo/${todo.id}/items/999999`)
          .send()
          .expect(404);
      });
    });

    describe('deleteAll', () => {
      let todo: any;
      let flux: any;
      let plutonium: any;
      before(async () => {
        todo = (await client.post('/todo').send({
          title: 'go shopping'
        })).body;
        flux = (await client.post(`/todo/${todo.id}/items`).send({
          title: 'flux capacitor'
        })).body;
        plutonium = (await client.post(`/todo/${todo.id}/items`).send({
          title: 'plutonium'
        })).body;
      });
      it('deletes all items if they exist', async () => {
        const path = `/todo/${todo.id}/items`;
        await client
          .del(path)
          .send()
          .expect(200);
        // Should not have items anymore.
        await client
          .get(path)
          .send()
          .expect(200, []);
      });
    });
  });

  function givenAnApplication() {
    app = new TodoApplication({
      rest: {
        port: 0
      },
      datasources: {
        ds: {
          name: 'ds',
          connector: 'memory'
        }
      }
    });
  }

  async function givenARestServer() {
    server = await app.getServer(RestServer);
  }
});
