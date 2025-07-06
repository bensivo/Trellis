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

  templateSelect = signal<number>(-1);

  readonly visibleNotes = computed(() => {
    const notes = this.notesStore.notes();
    const templateId = this.templateSelect();
    console.log(notes, templateId)

    if (templateId == -1) {
      return notes;
    }

    return notes.filter(n => n.templateId == templateId);
  }) 

  onChangeTemplateSelect(event: any) {
    const value = event.target.value;
    this.templateSelect.set(value);
  }
}
