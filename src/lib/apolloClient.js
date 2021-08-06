import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { THE_GRAPH_URL } from "../constants";

const client = url =>
  new ApolloClient({
    uri: url || THE_GRAPH_URL,
    cache: new InMemoryCache(),
  });

const apollo = (queryString, url) => {
  return client(url)
    .query({
      query: gql(queryString),
    })
    .then(data => {
      return data;
    })
    .catch(err => console.error("qraph ql error: ", err));
};

export default apollo;
