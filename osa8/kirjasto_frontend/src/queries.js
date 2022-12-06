import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql `
query {
    allAuthors {
      bookCount,
      born,
      name
    }
  }
`

export const ALL_BOOKS = gql `
query {
    allBooks {
      title,
      published,
      author {
        name
        born
        bookCount
      }
      genres
    }
  }
`

export const CREATE_BOOK = gql `
mutation createBook($title: String!, $published:Int!, $author:String!, $genres: [String!]!){
    addBook(
    published:$published,
    title:$title,
    genres:$genres,
    author:$author){
      title,
      author{
        name
      },
      published,
      genres
    }
  }
`
export const SET_BIRTHYEAR = gql `
mutation setBirthyear($name: String!, $setBornTo: Int!){
  editAuthor(
    name:$name,
    setBornTo:$setBornTo
  ){
    name,
    born
  }
}
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title,
      author {
        name
      }
    }
  }
`

export const FAVORITEGENRE = gql `
query {
    me {
      favoriteGenre
      username
    }
  }
` 