import { inject, Injectable } from "@angular/core";
import { NotesStore } from "../store/notes-store";
import { TemplatesStore } from "../store/templates-store";

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  readonly templatesStore = inject(TemplatesStore);
  readonly notesStore = inject(NotesStore);

  constructor() {

  }

}