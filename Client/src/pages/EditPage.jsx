import { useParams } from "react-router-dom";
import NoteWorkspace from "../components/NoteWorkspace";

export default function EditPage() {
  const { id } = useParams();
  return <NoteWorkspace noteId={id} />;
}
