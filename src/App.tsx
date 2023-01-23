import "bootstrap/dist/css/bootstrap.min.css"
import { useMemo } from "react"
import { Container } from "react-bootstrap"
import { Routes, Route, Navigate } from "react-router-dom"
import { NewNote } from "./NewNote"
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
  //localStorage to persist the information
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])

  //convert raw notes into real notes
  const notesWithTags = useMemo(() => {
    //loop through all my different notes
    return notes.map(note => {
      //for each note in keep all the information about the notes but also get the tags that have all the associated ID inside of the note that's being stored
      return {...note, tags: tags.filter(tag => note.tagIds.includes(tag.id))
      }
    })
  }, [notes, tags]) //just run when the notes or tags get updated

  //function to create notes
  function onCreateNotes({tags, ...data}: NoteData) {
    setNotes(prevNotes => {
      return [
        ...prevNotes, 
        {...data, id: uuidV4(), tagsIds: tags.map(tag => tag.id) },
      ]
    })
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/new" element={<NewNote />} />
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
