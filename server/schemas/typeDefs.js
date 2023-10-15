const typeDefs = `
type User {
  _id: ID!
  username: String!
  email: String!
  bookCount: Int
  savedBooks: [Book]
}

  type Book {
    bookId: ID!
    authors: String!
    description: String!
    title: String!
    image: String!
    link: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    books: [Book]
    users:[User]
    user(userId: ID!): User
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(name: String!, email: String!, password: String!): Auth

    saveBook( authors: [String]!
    description: String! title: String! bookId: ID! image: String!): User
    removeBook(bookId: ID!): User

  }
`;

module.exports = typeDefs;
