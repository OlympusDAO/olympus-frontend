import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { THE_GRAPH_ID } from "../constants";


const APIRUL = "https://api.thegraph.com/subgraphs/id/"+THE_GRAPH_ID;

const client = new ApolloClient({
	uri: APIRUL,
	cache: new InMemoryCache()
});


export default client;


