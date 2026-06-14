import { useState, useEffect } from 'react';
import axios from 'axios'
import './App.css';


const App = () => {

  const [notes, setNotes] = useState([])
  const [editId, setEditId] = useState(null)
  const [description, setDescription] = useState("")

  const fetchNotes = async () => {
    axios.get("http://localhost:3000/api/notes")
      .then((res) => {
        setNotes(res.data.notes)
      })
  }

  useEffect(() => {
    fetchNotes();
  }, [])

  const submitHandler = (e) => {
    e.preventDefault();
    const { title, description } = e.target.elements;
    axios.post("http://localhost:3000/api/notes", {
      title: title.value,
      description: description.value
    }).then((res) => {
      console.log(res.data);
      fetchNotes();
    })
  }

  const deleteHandler = (noteId) => {
    axios.delete("http://localhost:3000/api/notes/" + noteId)
      .then(res => {
        console.log(res.data);
        fetchNotes()
      })
    console.log(noteId);
  }

  const updateHandler = async () => {
    try {
      await axios.patch(`http://localhost:3000/api/notes/${editId}`, {
        description
      });
      fetchNotes();
      setEditId(null);
      setDescription("");
    } catch (err) {
      console.log(err);
    }

  }

  return (
    <>
      <form className='note-create-form' onSubmit={submitHandler}>
        <input name="title" type="text" placeholder='Title' />
        <input name="description" value={description} onChange={(e) => setDescription(e.target.value)} type="text" placeholder='Description' />
        <div className="btn-container">
          <button type="submit">Create Note</button>
          <button type="button" onClick={updateHandler}>Update Note</button>
        </div>
      </form>
      <div className="notes">
        {Array.isArray(notes) && notes.map(note => (
          <div className="note" key={note._id}>
            <h1>{note.title}</h1>
            <p>{note.description}</p>
            <div className="btn-container">
              <button className="delete-button" onClick={() => { deleteHandler(note._id) }}>Delete</button>
              <button className="edit-button" onClick={() => {
                setDescription(note.description)
                setEditId(note._id)
              }}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default App