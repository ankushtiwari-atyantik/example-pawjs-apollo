import React from 'react';
import gql from 'graphql-tag';

export default [
  {
    path: '/',
    exact: true,
    component: import('../app/components/home'),
    loadData: params => params.apolloClient
      .query({
        query: gql`
          {
           rates(currency: "USD") {
              currency
              rate
            }
          }
        `,
      }),
  },
  {
    path: '/rates',
    exact: true,
    component: import('../app/components/rates'),
    loadData: params => params.apolloClient
      .query({
        query: gql`
          {
           rates(currency: "EUR") {
              currency
              rate
            }
          }
        `,
      }),
  },
];
