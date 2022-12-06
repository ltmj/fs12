import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from './queries'
import { useQuery, useApolloClient, useSubscription } from '@apollo/client'
import BirthYear from './components/BirthYear'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'



const App = () => {
  const [token, setToken] = useState(null)
  const client = useApolloClient()
  const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState('authors')
  const authorResult = useQuery(ALL_AUTHORS, {
    pollInterval: 2000
  })
  
  const bookResult = useQuery(ALL_BOOKS, {
    pollInterval:2000
  })

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const b = subscriptionData.data.bookAdded
      window.alert(`New book added: ${b.title} by ${b.author.name}`)
    }
  })

  

  if(authorResult.loading && page){
    return <div>loading authors...</div>
  }

  if(bookResult.loading && page){
    return <div>loading books... </div>
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    },5000)
  }

  const logout = () => {
    setPage('books')
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  

  
  
  
  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? <button onClick={() => setPage('add')}>add book</button> : null}
        {token ? <button onClick={() => setPage('birth')}>set birth year</button> : null}
        {token ? <button onClick={() => setPage('recommended')}>Recommended</button> : null}
        {token ? null : <button onClick={() => setPage('login')}>login</button>}
        {token ? <button onClick={logout}>logout</button> : null}
      </div>

      <Notify errorMessage={errorMessage} />
      <Authors
        show={page === 'authors'}
        authors={authorResult.data.allAuthors}
      />

      <Books
        show={page === 'books'}
        books={bookResult.data.allBooks}
      />

      <NewBook
        show={page === 'add'} setError={notify}
      />

      <BirthYear 
        show={page === 'birth'} setError={notify}
        authors={authorResult.data.allAuthors}
      />

      <LoginForm 
          setToken={setToken}
          setError={notify}
          show={page === 'login'}
          setPage={setPage}
      />

      <Recommended 
        show={page==='recommended'}
        books={bookResult.data.allBooks}
      />

    </div>
  )
}

const Notify = ({errorMessage}) => {
  if ( !errorMessage ) {
    return null
  }
  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

export default App
