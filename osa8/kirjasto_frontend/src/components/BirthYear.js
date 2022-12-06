import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { SET_BIRTHYEAR, ALL_AUTHORS } from '../queries'

const BirthYear = (props) => {
  
  const [name, setName] = useState(props.authors[0].name)
  const [born, setBorn] = useState(0)

  const [ setBirthYear ] = useMutation(SET_BIRTHYEAR, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
    onError: (error) => {
        props.setError(error.message)
    }
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
        event.preventDefault()

        if(name==='' || born===0){
            props.setError('Invalid input')
        }
        else{
            console.log('set birthyear...')
            setBirthYear({ variables: { name: name, setBornTo:born } })
        }
        setBorn('')
        setName('')
   }

  return (
    <div>
      <form onSubmit={submit}>
        <br  />
        <div>
            <select value={name}
            onChange={({ target }) => setName(target.value)}
            >
              {props.authors.map(a => <option>{a.name}</option>)}
            </select>
        </div>
        <div>
          Birth Year
          <input
            type='number'
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default BirthYear