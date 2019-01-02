import gql from "graphql-tag";

export default gql(`
mutation($id: ID!) {
  deleteOption(input: { id: $id }) {
    id
    status
  }
}`);
