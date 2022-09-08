import React, { useState, useEffect } from 'react'
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button
} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { QUERY_ME } from '../utils/queries'
import { useQuery, useMutation } from '@apollo/client'
import { REMOVE_BOOK } from '../utils/mutation'
import { removeBookId } from '../utils/localStorage'

const SavedBooks = () => {
  const { loading, data, error: error_me } = useQuery(QUERY_ME)
  const [removeBook, { error }] = useMutation(REMOVE_BOOK)
  const navigate = useNavigate()
  const userData = data?.me || {}

  //THIS IS NOT PART OF THE SOLUTION or my preferred way of doing it, but it is
  // ONE WAY of demonstrate how useful the response from useQuery is, also they change dinamically,
  // the component redenders everytime they change
  // there is anoter way of using queries in a trigger basis instead here for more info about useLazyQuery: https://www.apollographql.com/docs/react/data/queries#manual-execution-with-uselazyquery

  useEffect(() => {
    let timeout
    if (error_me) {
      timeout = setTimeout(() => navigate('/'), 2000)
    }
    return () => (timeout ? clearTimeout(timeout) : void 0)
  }, [error_me])

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async bookId => {
    // the only reason why the solution rerenders every time we delete a book is
    // because we return the whole user from the backend and because we are specifying we want the whole user back, 
    //IF WE TAKE OUT ANY OF THE NECESSARY FIELDS THIS WOULD NOT WORK

    // other ways of managing new state without using actual state managers: refetch is the most straigh forward more here:
    // https://www.apollographql.com/docs/react/data/mutations#updating-local-data
    try {
      const { data } = await removeBook({
        variables: { bookId }
      })

      // upon success, remove book's id from localStorage
      removeBookId(bookId)
    } catch (err) {
      console.error(err)
    }
  }

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>
  }
  if (error_me)
    return <h1>You need to be logged in to access this section ... </h1>
  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData.savedBooks.map(book => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant='top'
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className='btn-block btn-danger'
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            )
          })}
        </CardColumns>
      </Container>
    </>
  )
}

export default SavedBooks
