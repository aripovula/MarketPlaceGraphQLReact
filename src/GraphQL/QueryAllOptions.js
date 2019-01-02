import gql from "graphql-tag";

export default gql(`
query {
  listOptions(limit: 1000) {
    items {
      id
      status
      price
      rating
    }
  }
}`);
