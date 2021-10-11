import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { THE_GRAPH_URL } from "../constants";

const client = () =>
  new ApolloClient({
    uri: THE_GRAPH_URL,
    cache: new InMemoryCache(),
  });

const apollo = queryString => {
  return client()
    .query({
      query: gql(queryString),
    })
    .then(data => {
      return data;
    })
    .catch(err => console.error("qraph ql error: ", err));
};

const extClient = uri =>
  new ApolloClient({
    uri: uri,
    cache: new InMemoryCache(),
  });

export const apolloExt = (queryString, uri) => {
  return extClient(uri)
    .query({
      query: gql(queryString),
    })
    .then(data => {
      return data;
    })
    .catch(err => console.error("external graph ql api error: ", err));
};

export default apollo;
