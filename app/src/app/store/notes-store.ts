import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { TemplateFieldType } from '../models/template-interface';
import { Note } from '../models/note-interface';

type NotesStore = {
    notes: Note[]
}

const initialState: NotesStore = {
    notes: [
        {
            id: 1,
            name: "Standup - March 5th",
            template: "Meeting",
            fields: [
                { name: "Date", type: TemplateFieldType.DATE, value: "2025-03-05" },
                { name: "Location", type: TemplateFieldType.TEXT, value: "Conference Room A" },
                { name: "Organizer", type: TemplateFieldType.TEXT, value: "Sarah Johnson" },
                { name: "Attendees", type: TemplateFieldType.TEXT, value: "John, Mike, Lisa, Alex, Emily, David, Rachel, Tom" }
            ],
            content: null,
        },
    ]
}

export const NotesStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store) => ({
        create(dto: Partial<Note>) {
            // TODO: do better here
            const nextId = Math.max(...store.notes().map(n => n.id)) + 1;
            patchState(store, (state) => {
                const newNote: Note = {
                    id: nextId,
                    name: 'Untitled',
                    template: 'Unknown',
                    fields: [],
                    content: null,
                    ...dto,
                }
                return {
                    notes: [...state.notes, newNote]
                }
            })
            return nextId;
        },
        updateNoteContent(id: number, content: any) {
            // Note: this is probably a very inefficient way to manage note state.
            // We're looping the entire note array everytime somethign changes in a single note.
            //
            // Potential future improvement, keep the current note in a separate store, just update
            // that store, then sync it back to the 'notes' array later
            patchState(store, (state) => {
                const notes = state.notes;

                return {
                    notes: notes.map(note => {
                        if (note.id !== id) {
                            return note
                        } else {
                            return {
                                ...note,
                                content,
                            }
                        }
                    })
                }
            })
        },
        updateNoteName(id: number, name: string) {
            patchState(store, (state) => {
                const notes = state.notes;

                return {
                    notes: notes.map(note => {
                        if (note.id !== id) {
                            return note
                        } else {
                            return {
                                ...note,
                                name,
                            }
                        }
                    })
                }
            })
        },
        updateNoteField(id: number, index: number, value: any) {
            patchState(store, (state) => {
                const notes = state.notes;

                return {
                    notes: notes.map(note => {
                        if (note.id !== id) {
                            return note
                        }
                        return {
                            ...note,
                            fields: note.fields.map((f, i) => {
                                if (i !== index) {
                                    return f
                                }
                                return {
                                    ...f,
                                    value
                                }
                            })
                        };
                    })
                };
            })
        }
    }))
);