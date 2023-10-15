import { gql } from "@apollo/client";

// execute login
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

// execute addUser
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

// execute saveBook
export const SAVE_BOOK = gql`
  mutation saveBook(
    $authors: [String]!
    $description: String!
    $title: String!
    $bookId: ID!
    $image: String!
  ) {
    saveBook(
      authors: $authors
      description: $description
      title: $title
      bookId: $bookId
      image: $image
    ) {
      _id
      username
      bookCount
      savedBooks {
        bookId
        title
      }
    }
  }
`;

// execute removeBook
export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
      _id
      username
      bookCount
      savedBooks {
        bookId
        title
      }
    }
  }
`;
