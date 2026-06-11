import { useState } from 'react';
import axios from 'axios'
import './App.css';
const App = () => {

  const [notes, setNotes] = useState([
    {
      title: "This is title 1",
      description: "This is description 1"
    },
    {
      title: "This is title 2",
      description: "This is description 2"
    },
    {
      title: "This is title 3",
      description: "This is description 3"
    },
    {
      title: "This is title 4",
      description: "This is description 4"
    },
  ])

  axios.get("http://localhost:3000/api/notes")
    .then((res) => {
      setNotes(res.data.notes)
    })

  return (
    <>
      <div className="notes">
        {notes.map(note => (
          <div className="note">
            <h1>{note.title}</h1>
            <p>{note.description}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default App
