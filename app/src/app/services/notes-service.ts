import { computed, inject, Injectable, Signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { NotesStore } from "../store/notes-store";
import { TemplatesStore } from "../store/templates-store";
import { Note } from "../models/note-interface";
import { filter, map, startWith } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  readonly templatesStore = inject(TemplatesStore);
  readonly notesStore = inject(NotesStore);

  readonly router = inject(Router);

  private readonly navigationEnd$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(() => this.router.routerState.root),
    startWith(this.router.routerState.root)
  );
  
  // Signal based on the router navigation events which returns a map of routeparams
  readonly routeParams = toSignal(
    this.navigationEnd$.pipe(
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route.snapshot.params;
      })
    ), 
    { 
      initialValue: null 
    }
  );

  readonly currentNoteId: Signal<number | null> = computed(() => {
    const params = this.routeParams();
    if (params == null) {
      return null;
    }
    return +params['noteid'];
  });

  readonly currentNote: Signal<Note| null> = computed(() => {
    const noteId = this.currentNoteId();
    const notes = this.notesStore.notes();

    if (noteId == null) {
      return null;
    }

    const note = notes.find(n => n.id == noteId);
    return note ?? null;
  })

}