import MakeNote from "./MakeNote";
import NoteList from "./NoteList";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-2">
      <MakeNote />
      <NoteList />
    </div>
  );
}
