import { ApolloProvider } from 'react-apollo';


export default class Client {

  apply(clientHandler) {
    clientHandler
      .hooks
      .beforeRender
      .tapPromise('AddApolloProvider', async (app) => {

        app.children = (
          <ApolloProvider client={client}>
            {app.children}
          </ApolloProvider>
        );
      });

    return app;
  }
}
