import { Component, computed, ElementRef, inject, Signal, ViewChild } from '@angular/core';
import { Template } from '../../models/template-interface';
import { NotesService } from '../../services/notes-service';
import { NotesStore } from '../../store/notes-store';
import { TemplatesStore } from '../../store/templates-store';
import { TAB_DATA, TabData, TabService } from '../tab-container/tab-service';
import { NoteTextEditor } from '../note-text-editor/note-text-editor';

@Component({
  selector: 'app-note-panel',
  imports: [
    NoteTextEditor,
  ],
  templateUrl: './note-panel.html',
  styleUrl: './note-panel.less'
})
export class NotePanel {
  readonly data: TabData = inject(TAB_DATA) as TabData;

  readonly templatesStore = inject(TemplatesStore);
  readonly notesStore = inject(NotesStore);
  readonly notesService = inject(NotesService);
  readonly tabService = inject(TabService);

  readonly currentNote = computed(() => {
    const notes = this.notesStore.notes();
    const note =  notes.find(n => n.id === this.data.id);
    if (!note) {
      return null;
    }

    return note;
  })

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

  @ViewChild('noteTextEditor') noteTextEditor!: NoteTextEditor;
  exportToPDF() {
    this.noteTextEditor.exportToPDF();
  }

  onFieldChange(index: number, event: Event) {
    const note = this.currentNote();
    if (note === null) {
      return;
    }

    const target: HTMLInputElement = (event as InputEvent).target as HTMLInputElement;
    const value = target.value;

    this.notesStore.updateNoteField(note.id, index, value);
  }

  // Called on every input change (each character)
  onInputTitle(event: any) {
    const note = this.currentNote();
    if (note === null) {
      return;
    }

    const value = event.target.value;
    this.notesStore.updateNoteName(note.id, value);
    this.tabService.updateTabTitle('note' + note.id, value);
  }

  // Called only when the input loses focus or the user presses Enter
  onChangeTitle(event: any) {
    const note = this.currentNote();
    if (note === null) {
      return;
    }

    const value = event.target.value;
    if (!value || value.trim() === '') {
      this.notesStore.updateNoteName(note.id, 'Untitled');
      this.tabService.updateTabTitle('note' + note.id, 'Untitled');
    }
  }

  onClickDeleteNote() {
    const note = this.currentNote();
    if (note === null) {
      return;
    }

    this.notesStore.delete(note.id);
    this.tabService.closeTab('note' + note.id);
  }
}
