import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { TemplateFieldType } from '../models/template-interface';
import { Note } from '../models/note-interface';

type NotesStore = {
    notes: Note[]
}

const initialState: NotesStore = {
    notes: [
        {
            id: 0,
            templateId: 0,
            name: 'Anita',
            fields: [],
            content: null,
        },
        {
            id: 1,
            templateId: 0,
            name: 'Ben',
            fields: [],
            content: null,
        },
        {
            id: 2,
            templateId: 1,
            name: 'Family',
            fields: [],
            content: null,
        },
     ]
}

export const NotesStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store) => ({
        create(dto: Partial<Note>) {
            const notes = store.notes();
            const nextId = notes.length === 0 ? 0 : Math.max(...store.notes().map(n => n.id)) + 1
            patchState(store, (state) => {
                const newNote: Note = {
                    id: nextId,
                    name: 'Untitled',
                    templateId: dto.templateId ?? -1,
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