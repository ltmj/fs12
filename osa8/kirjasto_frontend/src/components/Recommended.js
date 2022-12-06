import React from 'react'
import { useQuery } from '@apollo/client'
import { FAVORITEGENRE } from '../queries'

const Recommended = (props) => {
    const f = useQuery(FAVORITEGENRE, {pollInterval:200})

    if (!props.show) {
      return null
    }

    const books = props.books.filter(b => b.genres.includes(f.data.me.favoriteGenre))
    
  
    return (
      <div>
        <h2>recommendations</h2>
        <p> Books in your favorite genre - {f.data.me.favoriteGenre} </p>
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
        
      </div>
    )
}

export default Recommended
