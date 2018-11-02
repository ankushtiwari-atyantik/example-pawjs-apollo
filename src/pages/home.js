import ClientInstance from "../apollo-client";
import gql from "graphql-tag";

export default [
  {
    path: '/',
    exact: true,
    component: import('../app/components/home'),
    loadData: () => ClientInstance.query({
      query: gql`
      {
        books {
          title
          author
        }
      }
    `
    })
  },
];
