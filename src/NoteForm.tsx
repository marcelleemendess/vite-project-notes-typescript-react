import { FormEvent, useRef, useState} from "react"
import { Button, Col, Form, Row, Stack } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import CreatableReactSelect from "react-select/creatable"
import { NoteData, Tag } from "./App"
import { v4 as uuidV4 } from "uuid"

type NoteFormProps = {
    onSubmit: (data: NoteData) => void //void: expect nothing in return
    onAddTag: (tag: Tag) => void
    availableTags: Tag[]
} & Partial<NoteData> // Partial -> make it optional to pass data in it 

export function NoteForm({ 
    onSubmit, 
    onAddTag, 
    availableTags,
    title = "",
    markdown = "",
    tags = [], 
}: NoteFormProps) {
    const titleRef = useRef<HTMLInputElement>(null)
    const markdownRef = useRef<HTMLTextAreaElement>(null)
    const [selectedTags, setSelectedTags] = useState<Tag[]>([tags])
    const navigate = useNavigate()

    function handleSubmit(e: FormEvent) {
        e.preventDefault()

        onSubmit({
            title: titleRef.current!.value, //even though this value could be null, with '!' we're saying it's never going to be null 
            markdown: markdownRef.current!.value,
            tags: selectedTags, 
        })
        navigate("..")
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Stack gap={4}>
                <Row>
                    <Col>
                        <Form.Group controlId="title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control ref={titleRef} required defaultValue={title}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="tags">
                            <Form.Label>Tags</Form.Label>
                            <CreatableReactSelect
                                onCreateOption = {label => {
                                    const newTag = { id: uuidV4(), label }
                                    onAddTag(newTag) // to make sure we add to the local storage, function on the App.tsx
                                    setSelectedTags(prev => [...prev, newTag])
                                }}
                                value={selectedTags.map(tag => { //like you would expect from an option inside of a select
                                    return { label: tag.label, value: tag.id }
                                })}
                                options={availableTags.map(tag => {
                                    return { label: tag.label, value: tag.id}
                                })}
                                onChange={tags => {
                                    setSelectedTags(
                                        tags.map(tag => {
                                            return { label: tag.label, id: tag.value }
                                        })
                                    )
                                }}
                                isMulti 
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId="markdown">
                    <Form.Label>Body</Form.Label>
                    <Form.Control
                        defaultValue={markdown}
                        required as="textarea"
                        ref={markdownRef} 
                        rows={15} 
                    />
                </Form.Group>
                <Stack 
                    direction="horizontal" 
                    gap={2}       
                    className="justify-content-end"
                >
                    <Button type="submit" variant="primary">Save</Button>
                    <Link to="..">
                        <Button type="button" variant="outline-secondary">Cancel</Button>
                    </Link>
                </Stack>
            </Stack>
        </Form>
    )
}