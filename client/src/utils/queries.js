import { gql } from '@apollo/client';

// Define the GET_ME query to fetch user data
export const GET_ME = gql`
  query GET_ME {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
