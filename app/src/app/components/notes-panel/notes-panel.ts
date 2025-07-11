import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NotesService } from '../../services/notes-service';
import { NotesStore } from '../../store/notes-store';
import { TemplatesStore } from '../../store/templates-store';

@Component({
  selector: 'app-notes-panel',
  imports: [
    RouterLink,
  ],
  templateUrl: './notes-panel.html',
  styleUrl: './notes-panel.less'
})
export class NotesPanel {
  readonly templatesStore = inject(TemplatesStore);
  readonly notesStore = inject(NotesStore);
  readonly notesService = inject(NotesService);
  readonly currentNoteId = this.notesService.currentNoteId;

  searchInput = signal<string>('');
  templateSelect = signal<number>(-1);

  readonly visibleNotes = computed(() => {
    let notes = this.notesStore.notes();
    const templateId = this.templateSelect();
    const searchInput = this.searchInput();

    
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

    return notes;
  }) 

  onChangeTemplateSelect(event: any) {
    const value = event.target.value;
    this.templateSelect.set(value);
  }
  
  onChangeSearch(event: any) {
    const value = event.target.value;
    this.searchInput.set(value);
  }
}
