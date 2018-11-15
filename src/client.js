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
  loadAds = () => {
    setTimeout(() => {
      // eslint-disable-next-line
      if (typeof _codefund !== 'undefined' && _codefund.serve) {
        // eslint-disable-next-line
        _codefund.serve();
      }
      // (window.adsbygoogle = window.adsbygoogle || []).push({});
    }, 10);
  }

  trackPageView = () => {
    const { ga } = window;
    if (typeof ga !== 'undefined' && ga) {
      ga('send', {
        hitType: 'pageview',
        page: window.location.pathname,
      });
    }
  }

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
        this.loadAds();
        if (apolloClient) {
          // eslint-disable-next-line
          app.children = (
            <ApolloProvider client={apolloClient}>
              {app.children}
            </ApolloProvider>
          );
        }
      });
    clientHandler.hooks.renderComplete.tap('InitTracking', () => {
      window.ga = window.ga || function () {
        (window.ga.q = window.ga.q || []).push(arguments);
      };
      window.ga.l = +new Date;
      window.ga('create', 'UA-108804791-1', 'auto');
      window.ga('send', 'pageview', window.location.pathname);
    });
    clientHandler.hooks.locationChange.tapPromise('ReInitAds', async () => {
      this.loadAds();
      this.trackPageView();
    });
  }
}
