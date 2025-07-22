const NOTES_KEY = "MeetingNotesCollection";

// Load all notes
function loadMeetingNotes() {
  const data = localStorage.getItem(NOTES_KEY);
  return data ? JSON.parse(data).meetingNotes : [];
}

// Save all notes
function saveMeetingNotes(notes) {
  localStorage.setItem(NOTES_KEY, JSON.stringify({ meetingNotes: notes }));
}

// Add or update a note
function saveOrUpdateNote(note) {
  let notes = loadMeetingNotes();
  const idx = notes.findIndex(n => n.id === note.id);
  if (idx >= 0) {
    notes[idx] = { ...notes[idx], ...note, updatedAt: new Date().toISOString() };
  } else {
    note.createdAt = new Date().toISOString();
    note.updatedAt = note.createdAt;
    notes.push(note);
  }
  saveMeetingNotes(notes);
}

// Delete a note
function deleteNote(noteId) {
  let notes = loadMeetingNotes();
  notes = notes.filter(n => n.id !== noteId);
  saveMeetingNotes(notes);
}

// Export all notes as JSON
function exportAllNotes() {
  const notes = loadMeetingNotes();
  const blob = new Blob([JSON.stringify({ meetingNotes: notes }, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "meeting_notes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Export a single note as JSON
function exportNote(noteId) {
  const notes = loadMeetingNotes();
  const note = notes.find(n => n.id === noteId);
  if (!note) return;
  const blob = new Blob([JSON.stringify(note, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `meeting_note_${noteId}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Copy polished note to clipboard
function copyPolishedNote(noteId) {
  const notes = loadMeetingNotes();
  const note = notes.find(n => n.id === noteId);
  if (note && note.polishedNote) {
    navigator.clipboard.writeText(note.polishedNote);
  }
}