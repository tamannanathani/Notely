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
      <Button 
      variant="contained" 
      sx={{ mb: 3 }}
      onClick={() => navigate("/add")}> Add New Note
      </Button>
  
      {/* Notes Grid */}
      {notes.length === 0 ? (
        <Typography>No notes found. Add some!</Typography>
      ) : (
        <Grid container spacing={3} justifyContent="flex-start">
          {notes.map((note) => (
            <Grid
              item
              xs={12}  
              sm={6}   
              md={4}   
              key={note._id}
            >
              <Card
                sx={{
                  width: 300,       
                  height: 200,      
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: 2,
                  boxShadow: 3,
                  borderRadius: 2,
                }}
                onClick={() => navigate(`/edit/${note._id}`)}
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
                  onClick={(e)=> {
                     e.stopPropagation();
                      navigate(`/enhance/${note._id}`)}}>
                    Enhance</Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={(e) =>{
                       e.stopPropagation();
                       handleDelete(note._id)}}
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