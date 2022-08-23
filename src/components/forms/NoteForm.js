import React from 'react'

const NoteForm = ({ createNote, newNote, handleNoteChange }) => {

  const addNote = e => {
    e.preventDefault()
    createNote ({
      content: newNote,
      date: new Date().toISOString(),
      // important: Math.random() < 0.5,
      important: false
    })
  }

  return (
    <div className='formDiv'>
      <h2>Create new note</h2>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
          id="inputNewNote"
        />
        <button type="submit" id="inputSavedNote">save</button>
      </form>
    </div>
  )
}

export default NoteForm