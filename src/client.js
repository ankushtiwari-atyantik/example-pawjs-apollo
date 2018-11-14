import React from 'react';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
// eslint-disable-next-line
import fetch from 'universal-fetch';


export default class Client {
  apply = (clientHandler) => {
    let apolloClient = null;
    clientHandler
      .hooks
      .beforeLoadData
      .tapPromise('setParams', async (setParams) => {
        apolloClient = new ApolloClient({
          link: ApolloLink.from([
            onError(({ graphQLErrors, networkError }) => {
              if (graphQLErrors) {
                graphQLErrors.map(({ message, locations, path }) => console.log(
                  `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                ));
              }
              if (networkError) console.log(`[Network error]: ${networkError}`);
            }),
            new HttpLink({
              uri: 'https://w5xlvm3vzz.lp.gql.zone/graphql',
              credentials: 'same-origin',
            }),
          ]),
          // eslint-disable-next-line
          cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
        });
        setParams('apolloClient', apolloClient);
      });

    clientHandler
      .hooks
      .beforeRender
      .tapPromise('AddApolloProvider', async (app) => {
        if (apolloClient) {
          // eslint-disable-next-line
          app.children = (
            <ApolloProvider client={apolloClient}>
              {app.children}
            </ApolloProvider>
          );
        }
      });
  }
}
