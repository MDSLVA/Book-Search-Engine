import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import Navbar from './components/Navbar';
import AuthService from './utils/auth'; // Make sure to update the path

const httpLink = createHttpLink({
  uri: 'http://localhost:3001/graphql',
});

// Function to set the authorization header using the user's token
const authLink = setContext((_, { headers }) => {
  const userToken = AuthService.getToken();
  console.log("Client-side token:", userToken);

  console.log("Retrieved Token:", userToken); // For debugging purposes
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
