import React, {useState} from 'react'

const Books = (props) => {
  
  const [selectedGenre, setGenre] = useState('')
  if (!props.show) {
    return null
  }


  const books = selectedGenre === '' ? props.books : props.books.filter(b => b.genres.includes(selectedGenre))
  
  let allGenres = []
  props.books.map(book => {
    book.genres.map(
      gnr => {
        if(!allGenres.includes(gnr)){
          allGenres.push(gnr)
        }
        return null
      }
    )
    return null
  })

  return (
    <div>
      <h2>books</h2>
      {selectedGenre.length > 0 ? <p>in genre - {selectedGenre}</p> : null}
      <br   />
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        {allGenres.map(b => <button key={b} onClick={() => setGenre(b)}>{b}</button>)}
        <button onClick={() => setGenre('')}>all genres</button>
      </div>
      
    </div>
  )
}

export default Books