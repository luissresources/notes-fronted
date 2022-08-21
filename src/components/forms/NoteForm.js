import React, { useState } from 'react'
import noteService from '../../services/notes'

const NoteForm = ({ handleNotes, handleShowAll }) => {

  const [newNote, setNewNote] = useState('')

  const addNote = (e) => {
    e.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
    }

    noteService
      .create(noteObject)
      .then( () => {
        noteService
          .getAll()
          .then(response => {
            handleNotes(response)
          })
        handleShowAll(false)
        setNewNote('')
      })
  }

  const handleNoteChange = e => setNewNote(e.target.value)

  return (
    <div className='formDiv'>
      <h2>Create new note</h2>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm