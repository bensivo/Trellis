import { computed, inject, Injectable, Signal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { debounceTime } from "rxjs";
import { Note } from "../models/note-interface";
import { Template } from "../models/template-interface";
import { View } from "../models/view-interface";
import { NotesStore } from "../store/notes-store";
import { TemplatesStore } from "../store/templates-store";
import { ViewsStore } from "../store/views-store";
import { isElectron } from "../../utils";

export interface AppState {
    notes: Note[];
    templates: Template[];
    views: View[];
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
    readonly viewsStore = inject(ViewsStore);

    readonly appState: Signal<AppState> = computed(() => {
        const notes = this.notesStore.notes();
        const templates = this.templatesStore.templates();
        const views = this.viewsStore.views();

        return {
            notes,
            templates,
            views,
        }
    })

    // Convert the signals to an observable so we can debounce it and avoid unecessary computation
    readonly appState$ = toObservable(this.appState);

    constructor() {
        this.loadFromPersistedState();

        this.appState$.pipe(
            debounceTime(500),
        )
            .subscribe((appState) => {
                this.persistState(appState);
            });
    }

    async loadFromPersistedState() {
        let persistedAppStateStr;
        if (isElectron()) {
            persistedAppStateStr = await (window as any).electron.getObject('trellis-app-state.json');
        } else {
            persistedAppStateStr = localStorage.getItem('trellis-app-state');
        }

        if (!persistedAppStateStr) {
            console.warn('No persisted app state found.')
            return;
        }

        try {
            // TODO: use zod to schema validation on persisted state
            const persistedAppState: AppState = JSON.parse(persistedAppStateStr);
            this.notesStore.set(persistedAppState.notes ?? []);
            this.templatesStore.set(persistedAppState.templates ?? []);
            this.viewsStore.set(persistedAppState.views ?? []);
        }
        catch (e: any) {
            console.warn("Failed loading state from persisted app state", e);
        }
    }

    async persistState(appState: AppState) {
        if (isElectron()) {
            await (window as any).electron.putObject(
                'trellis-app-state.json',
                JSON.stringify(appState),
            );
        } else {
            localStorage.setItem('trellis-app-state', JSON.stringify(appState));
        }
    }
}