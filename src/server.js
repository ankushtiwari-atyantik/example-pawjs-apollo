import React from 'react';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
// eslint-disable-next-line
import fetch from 'universal-fetch';

export default class Server {
  apply = (serverHandler) => {
    serverHandler
      .hooks
      .beforeLoadData
      .tapPromise('setParams', async (setParams, getParams, req, res) => {
        try {
          res.locals.apolloClient = new ApolloClient({
            ssrMode: true,
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
            cache: new InMemoryCache(),
          });
        } catch (ex) {
          console.log(ex);
        }
        setParams('apolloClient', res.locals.apolloClient);
        return true;
      });

    serverHandler.hooks.beforeAppRender.tap('AddApolloProvider', (app, req, res) => {
      if (res.locals.apolloClient) {
        // eslint-disable-next-line
        app.children = (
          <ApolloProvider client={res.locals.apolloClient}>
            {app.children}
          </ApolloProvider>
        );
      }
    });

    serverHandler.hooks.beforeHtmlRender.tap('AddInitialApolloState', (app, req, res) => {
      if (res.locals.apolloClient && res.locals.apolloClient.extract) {
        app.htmlProps.head.push(
          <script
            key="InitialApolloState"
            dangerouslySetInnerHTML={{
              __html: `window.__APOLLO_STATE__=${JSON.stringify(res.locals.apolloClient.extract()).replace(/</g, '\\u003c')};`,
            }}
          />,
        );
      }
    });
  }
}
