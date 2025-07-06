import { Component, computed, ElementRef, HostListener, inject, Signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutMain } from '../../components/layout-main/layout-main';
import { NotesPanel } from '../../components/notes-panel/notes-panel';
import { NoteTextEditor } from '../../components/note-text-editor/note-text-editor';
import { NotesService } from '../../services/notes-service';
import { NotesStore } from '../../store/notes-store';
import { TemplatesStore } from '../../store/templates-store';
import { Template } from '../../models/template-interface';

@Component({
  selector: 'app-notes-page',
  imports: [
    NoteTextEditor,
    LayoutMain,
    NotesPanel,
  ],
  templateUrl: './notes-page.html',
  styleUrl: './notes-page.less'
})
export class NotesPage {
  readonly router = inject(Router);
  readonly templatesStore = inject(TemplatesStore);
  readonly notesStore = inject(NotesStore);
  readonly notesService = inject(NotesService);
  readonly currentNoteId = this.notesService.currentNoteId;
  readonly currentNote = this.notesService.currentNote;

  readonly currentTemplate: Signal<Template | null> = computed(() => {
    const currentNote = this.currentNote();
    if (!currentNote) {
      return null;
    }

    const templates = this.templatesStore.templates();
    return templates.find(t => t.id == currentNote.templateId) ?? null;
  })

  @ViewChild('notetitle') titleInput!: ElementRef<HTMLInputElement>;
  ngAfterViewInit() {
    setTimeout(() => {
      // Becuase we're using hash-routers, the "autofocus" on the input element doesn't work all the time
      // We add the manual call to focus() in afterViewInit as a workaround

      // Focus title, but only on brand new notes
      const note = this.currentNote();
      if (note && note.name === 'Untitled') {
        this.titleInput.nativeElement.select();
      }

    }, 0);
  }

  onFieldChange(index: number, event: Event) {
    const currentNoteId = this.currentNoteId();
    if (!currentNoteId) {
      return;;
    }

    const target: HTMLInputElement = (event as InputEvent).target as HTMLInputElement;
    const value = target.value;

    this.notesStore.updateNoteField(currentNoteId, index, value);
  }

  onChangeTitle(event: any) {
    const id = this.currentNoteId();
    if (id == null) {
      return;
    }

    const value = event.target.value;
    this.notesStore.updateNoteName(id, value);
  }
}
