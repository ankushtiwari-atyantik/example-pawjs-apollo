import React from 'react';
import FavIcon from './resources/img/favicon.ico';
import { ApolloProvider } from 'react-apollo';

import ClientInstance from "./apollo-client";
import fetch from "universal-fetch";


export default class Server {

  apply(serverHandler) {

    serverHandler.hooks.beforeAppRender.tap('AddApolloProvider', (app) => {

      app.children = (
        <ApolloProvider client={ClientInstance}>
          {app.children}
        </ApolloProvider>
      );
      return app;
    });
    serverHandler.hooks.beforeHtmlRender.tap('AddFavIcon', (Application) => {
      Application.htmlProps.head.push(
        <script key="InitialApolloState" dangerouslySetInnerHTML={{
          __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
        }} />,
      );
      return Application;
    });
  }
}
