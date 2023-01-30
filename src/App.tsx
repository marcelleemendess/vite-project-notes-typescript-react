import "bootstrap/dist/css/bootstrap.min.css"
import { useMemo } from "react"
import { Container } from "react-bootstrap"
import { Routes, Route, Navigate } from "react-router-dom"
import { NewNote } from "./NewNote"
import { NoteList } from "./NoteList"
import { useLocalStorage } from "./useLocalStorage"
import { v4 as uuidV4 } from "uuid"

//adds id to the the existing NoteData type
export type Note = {
  id: string
} & NoteData

export type RawNote = {
  id: string
} & RawNoteData

export type RawNoteData = {
  title: string
  markdown: string
  tagIds: string[]
}

export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
}

export type Tag = {
  id: string
  label: string
}

function App() { 
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])

  //convert raw notes into real notes
  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id)) }
    })
  }, [notes, tags])

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes(prevNotes => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id) },
      ]
    })
  }

  function addTag(tag: Tag) {
    setTags(prev => [...prev, tag])
  }
  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={< NoteList />} />
        <Route path="/new" 
          element={
            <NewNote 
              onSubmit={onCreateNote} 
              onAddTag={addTag} 
              availableTags={tags} 
            />
          } 
        />
        <Route path="/:id">
          <Route index element={<h1>Show</h1>} />
          <Route path="edit" element={<h1>Edit</h1>} />
        </Route>
        {/* Navigate comp. to when the user navigate to a url unavailable, navigates back */}
        <Route path="*" element={<Navigate to="/"/>} />
      </Routes>
    </Container>
  )  
}

export default App
