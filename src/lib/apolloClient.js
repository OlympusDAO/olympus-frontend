import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { THEGRAPH_ID } from "../constants";
const APIRUL = "https://api.thegraph.com/subgraphs/id/"+THEGRAPH_ID;

const client = new ApolloClient({
	uri: APIRUL,
	cache: new InMemoryCache()
});

export default client;


