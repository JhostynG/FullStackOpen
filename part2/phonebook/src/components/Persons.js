import React from 'react'
import Person from './Person'

const Persons = ({ persons, handler }) => {
  return (
    <div>
      {persons.map(person =>
        <Person key={person.id} person={person} handler={() => handler(person)} />
      )}
    </div>
  )
}

export default Persons