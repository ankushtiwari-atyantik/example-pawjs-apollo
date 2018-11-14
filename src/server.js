import React from 'react';
import { ApolloLink } from "apollo-link";
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from "universal-fetch";


export default class Server {
  apply(serverHandler) {
    const apollo = {client: null};
      serverHandler
        .hooks
        .beforeLoadData
        .tap('setParams', (setParams) => {
          apollo.client = new ApolloClient({
            ssrMode: true,
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
            cache: new InMemoryCache()
          });
          setParams('client', apollo.client);
        });

    serverHandler.hooks.beforeAppRender.tap('AddApolloProvider', (app) => {
      if (apollo.client) {
        app.children = (
          <ApolloProvider client={apollo.client}>
            {app.children}
          </ApolloProvider>
        );

        res.locals.client = apollo.client;
      }
    });
    serverHandler.hooks.beforeHtmlRender.tap('AddInitialApolloState', (app, req, res) => {
      if (res.locals.client && res.locals.client.extract) {
        app.htmlProps.head.push(
          <script key="InitialApolloState" dangerouslySetInnerHTML={{
            __html: `window.__APOLLO_STATE__=${JSON.stringify(res.locals.client.extract()).replace(/</g, '\\u003c')};`,
          }}/>,
        );
      }
    });
  }
}
