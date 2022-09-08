import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ApolloClient, InMemoryCache, ApolloProvider,createHttpLink } from '@apollo/client';
// https://www.apollographql.com/docs/react/get-started/   instructions in how to get started here 
import { setContext } from '@apollo/client/link/context';
import './index.css';
import App from './App';

const httpLink = createHttpLink({
  uri:'/graphql'
})
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});


// our apollo client will be our way to communicate with the backend
// this is pretty similar to axios instance if you are familiar with it
// then all we do in share this globally using our provider
const client = new ApolloClient({
  link:authLink.concat(httpLink),
  cache: new InMemoryCache()
})

ReactDOM.render(
 
    <ApolloProvider client={client}>
    <App />
    </ApolloProvider>
 ,
  document.getElementById('root')
);
