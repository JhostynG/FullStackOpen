import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameToFilter, setNameToFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('message')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const notify = (newMessage, type) => {
    setMessage(newMessage)
    setMessageType(type)
    setTimeout(() => {
      setMessage(null)
    }, 2000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const duplicatedPerson = persons.find(person => person.name === newName)

    if (duplicatedPerson) {
      if (window.confirm(`${newName} is alredy added to de phonebook, replace the old number with a new one?`)) {
        const newPerson = { ...duplicatedPerson, number: newNumber }
        personService
          .update(duplicatedPerson.id, newPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== duplicatedPerson.id ? person : returnedPerson))
            notify(`${returnedPerson.name}'s number changed`, 'message')
            setNewName('')
            setNewNumber('')
          })
          .catch(() => {
            notify(`information of ${duplicatedPerson.name} has already been remove from the server`, 'error')
            setPersons(persons.filter(p => p.id !== duplicatedPerson.id))
          })
      }
    }

    else {
      const personObject = {
        name: newName,
        number: newNumber
      }

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          notify(`Added ${returnedPerson.name}`, 'message')
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const handleNameChange = (event) => setNewName(event.target.value)

  const handleNumberChange = (event) => setNewNumber(event.target.value)

  const handleNameToFilterChange = (event) => setNameToFilter(event.target.value)

  const handleDeleteClick = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(person.id)
        .then(setPersons(persons.filter(p => p.id !== person.id)))
    }
  }

  const personsToShow = persons.filter(person =>
    (person.name.toLowerCase().includes(nameToFilter.toLowerCase()))
  )

  return (
    <div>

      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />
      <Filter
        name={nameToFilter}
        handler={handleNameToFilterChange}
      />

      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} handler={handleDeleteClick} />
    </div>
  )
}

export default App