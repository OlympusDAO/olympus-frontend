import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { THE_GRAPH_ID } from "../constants";


const APIRUL = "https://api.thegraph.com/subgraphs/id/"+THE_GRAPH_ID;

const client = new ApolloClient({
	uri: APIRUL,
	cache: new InMemoryCache()
});


const apollo = (queryString) => {
	return client.query({
		query: gql(queryString)
	})
	.then(data => {
		return data;
	})
	.catch(err => console.log('qraph ql error: ', err));
}


export default apollo;


