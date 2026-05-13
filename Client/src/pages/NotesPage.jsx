import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import NoteCard from "../components/ui/NoteCard";
import Spinner from "../components/ui/Spinner";

export default function NotesPage(){

    const[notes,setNotes]=useState([]);
    const[form,setForm]=useState({title:"",content:""})
    const[loading,setLoading]=useState(true);
    const navigate=useNavigate();
    //fetch all notes
    const fetchNotes=async()=>{
        try{
        const res= await api.get("/notes")
        setNotes(res.data);
        }catch(err){
            console.log(err)
            alert("Failed to fetch Notes")
        }finally{
            setLoading(false);
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary-600 mb-2">My Notes</h1>
            <p className="text-gray-600">Keep track of your thoughts and ideas</p>
          </div>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => navigate("/add")}
            className="mt-4 sm:mt-0"
          >
            + Add New Note
          </Button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg">No notes found yet.</p>
            <p className="text-gray-500">Start creating notes to organize your thoughts!</p>
            <Button 
              variant="primary" 
              size="md"
              onClick={() => navigate("/add")}
              className="mt-6"
            >
              Create Your First Note
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                title={note.title}
                content={note.content}
                date={note.createdAt || note.updatedAt}
                onClick={() => navigate(`/edit/${note._id}`)}
                actions={
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e)=> {
                        e.stopPropagation();
                        navigate(`/enhance/${note._id}`)
                      }}
                    >
                      Enhance
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) =>{
                        e.stopPropagation();
                        handleDelete(note._id)
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
    )
}
