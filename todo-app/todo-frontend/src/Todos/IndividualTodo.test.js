import React from 'react'
import {render, screen} from '@testing-library/react'
import IndividualTodo from './IndividualTodo'

const testTodo = {text: 'this is a todo for testing purposes only', done: false}
const dt = (todo) => console.log('delete')
const ct = (todo) => console.log('complete')

describe('Individual todo', () => {
  test('renders individual todo', () => {
    render(<IndividualTodo todo={testTodo} completeTodo={ct} deleteTodo={dt} />)
    screen.debug()
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Set as done')).toBeInTheDocument();
  })

})
