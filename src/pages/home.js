import React from 'react';
import gql from "graphql-tag";

export default [
  {
    path: '/',
    exact: true,
    component: import('../app/components/home'),
    loadData: (params) => {
      return params.client
        .query({
          query: gql`
          {
           rates(currency: "USD") {
              currency
              rate
            }
          }
        `
        })
    }
  },
  {
    path: '/rates',
    exact: true,
    component: import('../app/components/rates'),
    loadData: (params) => {
      if (params.client) {
        return params.client
          .query({
            query: gql`
            {
             rates(currency: "USD") {
                currency
                rate
              }
            }
          `
          })
      }
      return null;
    },
  }
];
