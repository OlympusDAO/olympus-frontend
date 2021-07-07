import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
<<<<<<< HEAD
import { THE_GRAPH_URL } from "../constants";

const client = new ApolloClient({
  uri: THE_GRAPH_URL,
=======
import { THE_GRAPH_ID } from "../constants";

const APIRUL = "https://api.thegraph.com/subgraphs/id/" + THE_GRAPH_ID;

const client = new ApolloClient({
  uri: APIRUL,
>>>>>>> imported new icons (still need to implement), cformatted files to clear prettier warnings, still need to fix advanced settings and style input fields
  cache: new InMemoryCache(),
});

const apollo = queryString => {
  return client
    .query({
      query: gql(queryString),
    })
    .then(data => {
      return data;
    })
<<<<<<< HEAD
    .catch(err => console.error("qraph ql error: ", err));
=======
    .catch(err => console.log("qraph ql error: ", err));
>>>>>>> imported new icons (still need to implement), cformatted files to clear prettier warnings, still need to fix advanced settings and style input fields
};

export default apollo;
