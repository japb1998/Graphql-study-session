const { gql } = require('apollo-server');


module.exports = gql`
type User {
    _id: ID!
    username: String!
    email: String
    bookCount: Int
    savedBooks: [Book] # this just means this will be an array full of Books types or Null, 
    # you could enforce the value to not be NULL [Book!] (the array can be null but not the contents inside), [Book]! the response can't be null 
    # [Book!]! none of them can be null
}
type Book {
    bookId: ID!
    authors: [String]
    description: String
    image: String
    link: String
    title: String!
  }
  type Auth {
    token: ID! 
    user: User
  }

  input BookInput { # inputs are types and can only have other inputs inside
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type Query { # queries here should have the same name that they have in the resolvers and 
  # whatever is to the right of the : is the type to be returned
    me: User
  }
#   input loginInput {
#     email:String!
#     password:String!
#   }
#   input addUserInput {
#     email:String!
#     password:String!
#     username:String!
#   }


# COMMON ERRORS: Error: "Mutations" defined in resolvers, but not in schema
  type Mutation {
    login(email: String!, password: String!): Auth # this could easily be an input login(loginInput: loginInput!): Auth
    addUser(username: String!, email: String!, password: String!): Auth # this could easily be an input 
    saveBook(bookData: BookInput!): User
    removeBook(bookId: ID!): User
  }
`
// on top of types , querys and resolvers
// we also have unions, interfaces an other cool stuffs for more on that https://www.apollographql.com/docs/apollo-server/schema/unions-interfaces/#union-type
