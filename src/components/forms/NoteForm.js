import React from 'react'

const NoteForm = ({ addNote, newNote, handleNoteChange }) => {

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