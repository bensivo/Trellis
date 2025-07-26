import { Component, computed, inject, signal } from '@angular/core';
import { Note } from '../../models/note-interface';
import { NotesService } from '../../services/notes-service';
import { NotesStore } from '../../store/notes-store';
import { TemplatesStore } from '../../store/templates-store';
import { NewNotePanel } from '../new-note-panel/new-note-panel';
import { NotePanel } from '../note-panel/note-panel';
import { TabService } from '../tab-container/tab-service';

@Component({
  selector: 'app-notes-panel',
  imports: [ ],
  templateUrl: './notes-panel.html',
  styleUrl: './notes-panel.less'
})
export class NotesPanel {
  readonly templatesStore = inject(TemplatesStore);
  readonly notesStore = inject(NotesStore);
  readonly notesService = inject(NotesService);
  readonly tabService = inject(TabService);

  searchInput = signal<string>('');
  templateSelect = signal<number>(-1);

  readonly visibleNotes = computed(() => {
    let notes = this.notesStore.notes();
    const templates = this.templatesStore.templates();
    const templateId = this.templateSelect();
    const searchInput = this.searchInput();

    const templateIdNameMap: Record<number, string> = {};
    templates.forEach(t => {
      templateIdNameMap[t.id] = t.name;
    });

    
    if (templateId != -1) {
      notes = notes.filter(n => n.templateId == templateId);
    }

    if (searchInput !== '') {
      // TODO: more robust search function
      const normalizedSearchInput = searchInput.toLowerCase().trim();
      notes = notes.filter(n => (
        n.name.toLowerCase().includes(normalizedSearchInput)
      ))
    }

    return notes.map(note => {
      return {
        ...note,
        templateName: templateIdNameMap[note.templateId] || 'Unknown Template'
      };
    });
  }) 

  onChangeTemplateSelect(event: any) {
    const value = event.target.value;
    this.templateSelect.set(value);
  }
  
  onChangeSearch(event: any) {
    const value = event.target.value;
    this.searchInput.set(value);
  }

  onClickNote(note: Note) {
    this.tabService.addTab('note'+note.id, note.name, NotePanel, {
      id: note.id,
    })
  }

  onClickNewNote() {
    this.tabService.addTab('newnote', 'New Note', NewNotePanel, {});
  }
}
