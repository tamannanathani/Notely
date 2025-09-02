import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import {
    Box,Container,Typography,Grid,
  Card,CardContent,CardActions,
  Button,TextField }
from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function NotesPage(){

    const[notes,setNotes]=useState([]);
    const[form,setForm]=useState({title:"",content:""})
    const navigate=useNavigate();
    //fetch all notes
    const fetchNotes=async()=>{
        try{
        const res= await api.get("/notes")
        setNotes(res.data);
        }catch(err){
            console.log(err)
            alert("Failed to fetch Notes")
        }
    }
    useEffect(()=>{
        fetchNotes();
    },[])

    //add or update notes
    const handleSubmit=async(event)=>{
        event.preventDefault();
        try{
            await api.post("/notes",form)
            alert("Note added Successfully!")
            setForm({title:"",content:""})
            fetchNotes();
        }catch(err){
            console.log("failed to save note",err)
            alert("Failed to save note try again later")
        }
    }

    //delete notes
    const handleDelete=async(id)=>{
        try{
          await api.delete(`/notes/${id}`);
      alert("Note deleted");
      fetchNotes();
        }catch(err){
            console.log("error while deleting",err)
            alert("Failed to delete note.Please try again")
        }
    }
    
    return(
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#16918f", mb: 3 }}
      >
        My Notes
      </Typography>

      {/* Add Note Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 500,
          mx: "auto",
        }}
      >
        <TextField
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          fullWidth
        />
        <TextField
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
          fullWidth
          multiline
          rows={4}
        />
        <Button type="submit" variant="contained">
          Add Note
        </Button>
      </Box>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <Typography>No notes found. Add some!</Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {notes.map((note) => (
            <Grid
              item
              xs={12}  // small: 1 per row
              sm={6}   // medium: 2 per row
              md={4}   // large: 3 per row
              key={note._id}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Card
                sx={{
                  width: 300,       // fixed width
                  height: 250,      // fixed height
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: 2,
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    overflowY: "auto", // scroll if content too long
                  }}
                >
                  <Typography variant="h6">{note.title}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {note.content}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: "flex-end" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/edit/${note._id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(note._id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
    )
}