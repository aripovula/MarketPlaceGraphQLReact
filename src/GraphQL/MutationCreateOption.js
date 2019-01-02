import gql from "graphql-tag";

export default gql(`
mutation($status: String! $price: Int! $rating: Float!) {
  createOption( input: {
    status: $status
    price: $price
    rating: $rating
    }
  ) {
    id
    status
    price
    rating
  }
}`);
