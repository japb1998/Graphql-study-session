import {gql} from '@apollo/client'
// mutation is needed to indicate the transaction type
// ($bookData: BookInput!) anything with \$\variableName is a variable 
export const SAVE_BOOK =    gql`mutation saveBook($bookData: BookInput!){
    saveBook(bookData: $bookData) {
      username
      savedBooks {
        authors
        description
        image
        link
        title
      } 
    }
  }`

export const LOGIN_USER = gql`
mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      username
    }
  }
}
`;

export const ADD_USER = gql`
mutation addUser($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
    token
    user {
      _id
      username
    }
  }
}
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        image
        description
        title
        link
      }
    }
  }
`
// NOTE: if String is !(REQUIRED) in the typeDefs you have to make your variable required as well ex .mutation addUser($username: String!, $email: String!, $password: String!)
