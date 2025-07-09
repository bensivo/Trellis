import { computed, effect, inject, Injectable, Signal } from "@angular/core";
import { NotesStore } from "../store/notes-store";
import { TemplatesStore } from "../store/templates-store";
import { Note } from "../models/note-interface";
import { Template } from "../models/template-interface";
import { patchState } from "@ngrx/signals";
import { toObservable } from "@angular/core/rxjs-interop";
import { debounce, debounceTime } from "rxjs";

export interface AppState {
    notes: Note[];
    templates: Template[];
}

/**
 * Listens to all signalStore values, and persists them to different storage mechanisms,
 * localStorage for Browsers, and the FileSystem for Electron.
 */
@Injectable({
    providedIn: 'root'
})
export class PersistenceService {
    readonly notesStore = inject(NotesStore);
    readonly templatesStore = inject(TemplatesStore);

    readonly appState: Signal<AppState> = computed(() => {
        const notes = this.notesStore.notes();
        const templates = this.templatesStore.templates();

        return {
            notes,
            templates,
        }
    })

    // Convert the signals to an observable so we can debounce it and avoid unecessary computation
    readonly appState$ = toObservable(this.appState); 

    constructor() {
        const persistedAppStateStr = localStorage.getItem('trellis-app-state');
        if (persistedAppStateStr) {
            try {
                // TODO: use zod to schema validation on persisted state
                const persistedAppState: AppState = JSON.parse(persistedAppStateStr);
                this.notesStore.set(persistedAppState.notes);
                this.templatesStore.set(persistedAppState.templates);
            }
            catch(e: any) {
                console.warn("Failed loading state from local storage", e);
            }
        }

        this.appState$.pipe(
            debounceTime(500),
        )
        .subscribe((appState) => {
            localStorage.setItem('trellis-app-state', JSON.stringify(appState));
        });
    }
}