import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AuthService from './utils/auth'; // Import the client-side auth.js

import Navbar from './components/Navbar';

const httpLink = createHttpLink({
  uri: '/graphql',
});

// Function to set the authorization header using the user's token
const authLink = setContext((_, { headers }) => {
  const userToken = localStorage.getItem("id_token"); // Get the user's token
  const authorization = userToken ? `Bearer ${userToken}` : '';
  return {
    headers: {
      ...headers,
      authorization,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


function App() {
  

  return (
    <ApolloProvider client={client}>
      <Navbar /> 
      <Outlet />
    </ApolloProvider>
  );
}

export default App;



