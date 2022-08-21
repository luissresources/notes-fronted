import React, {useState, useEffect} from 'react'
import Footer from './components/Footer'
import LoginForm from './components/forms/LoginForm'
import NoteForm from './components/forms/NoteForm'
import Note from './components/Note'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import loginService from './services/login'
import noteService from './services/notes'

const App = () => {

  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(response => {
        setNotes(response)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(note.id, changedNote)
        .then(returnedNote => {
          noteService
            .getAll()
              .then(notes => {
                setNotes(notes)
              })
          })
        .catch(error => {
          setErrorMessage(
            `Note '${note.content}' was already removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setNotes(notes.filter(n => n.id !== id))
        })
  }

  const filter = notes.filter(note => {
    return (
      showAll 
      ? note.important === showAll
      : note.important === true || note.important === false
    )
  })

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )

      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <>
      <h1>Notes</h1>
      <Notification 
        message={errorMessage}
      />
      { user === null 
        ? 
          <Togglable buttonLabel='login'>
            <LoginForm
              handleLogin= { handleLogin }
              username = { username }
              setUsername = { setUsername }
              password = { password }
              setPassword = { setPassword }
            />
          </Togglable>
        : 
          <div>
            <p>{user.name} logged in</p>
            <div>
              <div>
                <button onClick={() => setShowAll(!showAll)}>
                  show {!showAll ? 'important' : 'all' }
                </button>
              </div>      
              <ul>
                {
                  <>
                    {filter.map((note, i) => 
                      <Note
                        key={i}
                        note={note} 
                        toggleImportance={() => toggleImportanceOf(note.id)}
                      />
                    )} 
                  </>
                }
              </ul>
            </div>
            <Togglable buttonLabel='new note'>
              <NoteForm 
                handleNotes = {(notes) => setNotes(notes)}
                handleShowAll = {(all) => setShowAll(all)}
              />
            </Togglable>
          </div>
      }
      <Footer />
    </>
  )
} 

export default App;