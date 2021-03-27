import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import {
  ApolloClient,
  InMemoryCache,
  gql,
  ApolloProvider,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

console.log("Before client");
/*
client
  .query({
    query: gql`
      query GetAllTrees {
        getAllTrees {
          id
          common_name
        }
      }
    `,
  })
  .then((res) => console.log(res.data.getAllTrees));
  */
console.log("After client");

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
