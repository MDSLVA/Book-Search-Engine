import React from 'react';
import { useQuery, useMutation } from '@apollo/client'; // Import Apollo Client hooks
import { GET_ME } from '../utils/queries'; // Import the GET_ME query
import { REMOVE_BOOK } from '../utils/mutations'; // Import the REMOVE_BOOK mutation
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  // Use the useQuery hook to execute the GET_ME query and get user data
  const { data } = useQuery(GET_ME);
  const userData = data?.me || {}; // Extract the user data from the query result

  // Define the useMutation hook for the REMOVE_BOOK mutation
  const [removeBookMutation] = useMutation(REMOVE_BOOK);

  // Function to handle deleting a saved book using the Apollo useMutation hook
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Execute the REMOVE_BOOK mutation using the Apollo useMutation hook
      await removeBookMutation({
        variables: { bookId },
      });

      // If the mutation is successful, update the user data without the removed book
      const updatedUser = { ...userData };
      updatedUser.savedBooks = updatedUser.savedBooks.filter((book) => book.bookId !== bookId);
      // Update the user data in the Apollo Client cache
      cache.writeQuery({
        query: GET_ME,
        data: { me: updatedUser },
      });

      // Remove the book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
