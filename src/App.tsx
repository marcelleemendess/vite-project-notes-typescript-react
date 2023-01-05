import "bootstrap/dist/css/bootstrap.min.css"
import { Routes, Route, Navigate } from "react-router-dom"

function App() { 
  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/new" element={<h1>New</h1>} />
      <Route path="/:id">
        <Route index element={<h1>Show</h1>} />
        <Route path="edit" element={<h1>Edit</h1>} />
      </Route>
      {/* Navigate comp. to when the user navigate to a url unavailable, navigates back */}
      <Route path="*" element={<Navigate to="/"/>} />
    </Routes>
  )  
}

export default App
