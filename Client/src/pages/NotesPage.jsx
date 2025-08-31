import { useState } from "react";

export default function NotesPage(){

    const[notes,setNotes]=useState([
        {id:1,title:"First Note",content:"This is the content of the first note."},
        {id:2,title:"Second Note",content:"This is the content of the second note."}
    ]);

    const[form,setForm]=useState(
        {title:"",content:""}
    )
    
    const[editId,setEditId]=useState(null)
    const handleSubmit=(event)=>{
        event.preventDefault();

        if(editId){
            setNotes(
                notes.map((note)=>
                    note.id===editId?{...note,...form}:note
                )
            );
            setEditId(null);
        }else{
        const newNote={
            id:Date.now(),
            title:form.title,
            content:form.content,
        };
        setNotes([...notes,newNote]);
        setForm({title:"",content:""})
    }
}

    const handleDelete=(id)=>{
        setNotes(notes.filter
            ((note)=>note.id!==id))
    }
    const handleEdit=(note)=> {
    setForm({ title: note.title, content: note.content });
    setEditId(note.id);
}
    return(
       < div style={{padding:"10px"}}>
        <h1>My Notes</h1>
        <form onSubmit={handleSubmit}>
            <input type="text"
            placeholder="add new note"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            ></input><br></br><br></br>
            <textarea 
            placeholder="enter notes content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
            ></textarea><br></br>
            <button type="submit">{editId?"Update Note":"Add Note"}</button>
        </form>
        <ul>
            {notes.map((note)=>(
                <li key={note.id} style={{marginBottom:"10px"}}>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                    <button onClick={()=>handleEdit(note)}>Edit</button>
                    <button onClick={()=>handleDelete(note.id)}>Delete</button>
                </li>
            ))}
        </ul>
        
       </div>
    )
}