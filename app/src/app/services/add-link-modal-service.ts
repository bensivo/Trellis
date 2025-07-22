import { computed, inject, Injectable, signal, Signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router } from "@angular/router";
import { filter, map, startWith } from "rxjs";
import { Note } from "../models/note-interface";
import { NotesStore } from "../store/notes-store";
import { TemplatesStore } from "../store/templates-store";

@Injectable({
  providedIn: 'root'
})
export class AddLinkModalService {

  isVisible = signal<boolean>(false);
  callback: (noteId: number, noteName: string) => void = (_) => {};

  openAddLinkModal(callback: (noteId: number, noteName: string) => void) {
    this.callback = callback;
    this.isVisible.set(true);
  }

  closeAddLinkModal() {
    this.isVisible.set(false);
  }
}