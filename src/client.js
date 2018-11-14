import React from 'react';
import { ApolloLink } from "apollo-link";
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';


export default class Client {
  apply(clientHandler) {
    const apollo = {client: null};
    clientHandler
      .hooks
      .beforeLoadData
      .tap('setParams', (setParams, getParams) => {
        setParams('client',
        apollo.client = new ApolloClient({
          link: ApolloLink.from([
            onError(({ graphQLErrors, networkError }) => {
              if (graphQLErrors)
                graphQLErrors.map(({ message, locations, path }) =>
                  console.log(
                    `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                  ),
                );
              if (networkError) console.log(`[Network error]: ${networkError}`);
            }),
            new HttpLink({
              uri: 'https://w5xlvm3vzz.lp.gql.zone/graphql',
              credentials: 'same-origin'
            })
          ]),
          cache: new InMemoryCache().restore(window.__APOLLO_STATE__)
        }));
        setParams('client', apollo.client);
      });

    clientHandler
      .hooks
      .beforeRender
      .tapPromise('AddApolloProvider', async (app) => {
        if (apollo.client) {
          app.children = (
            <ApolloProvider client={apollo.client}>
              {app.children}
            </ApolloProvider>
          );
        }
    });
  }
}
