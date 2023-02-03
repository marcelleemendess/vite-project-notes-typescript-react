import { Navigate, Outlet, useParams, useOutletContext } from "react-router-dom"
import { Note } from "./App"

type NoteLayoutProps = {
    notes: Note[]
}

export function NoteLayout({ notes }: NoteLayoutProps) {
    const { id } = useParams()
    const note = notes.find(n => n.id === id)

    //if the note does not exist, redirect to the home page 
    if (note == null) return <Navigate to="/" replace/>

    return <Outlet context={note} />
}

export function useNote(){
    return useOutletContext<Note>()
}