import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { THE_GRAPH_URL } from "../constants";


const client = new ApolloClient({
	uri: THE_GRAPH_URL,
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


