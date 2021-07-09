import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { THE_GRAPH_URL } from "../constants";

<<<<<<< HEAD
<<<<<<< HEAD
const client = new ApolloClient({
  uri: THE_GRAPH_URL,
  cache: new InMemoryCache(),
=======

const client = new ApolloClient({
	uri: THE_GRAPH_URL,
	cache: new InMemoryCache()
>>>>>>> Connect subgraph by name
=======
const client = new ApolloClient({
  uri: THE_GRAPH_URL,
  cache: new InMemoryCache(),
>>>>>>> updated to ohmCirculatingSupply
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
    .catch(err => console.log("qraph ql error: ", err));
=======
    .catch(err => console.error("qraph ql error: ", err));
>>>>>>> updated to ohmCirculatingSupply
};

export default apollo;
