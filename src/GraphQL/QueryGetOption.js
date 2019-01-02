import gql from "graphql-tag";

export default gql(`
query($id: ID!) {
  getOption(id: $id) {
    id
    status
    price
    rating
  }
}`);
