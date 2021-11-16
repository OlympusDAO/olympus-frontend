// import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

// import React from "react";
import ReactDOM from "react-dom";
import Root from "./Root";

// const subgraphUri = "http://localhost:8000/subgraphs/name/scaffold-eth/your-contract";

// const client = new ApolloClient({
//   uri: subgraphUri,
//   cache: new InMemoryCache(),
// });

ReactDOM.render(<Root />, document.getElementById("root"));
