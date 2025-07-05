import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TextEditorComponent } from '../../components/text-editor/text-editor';
import { NotesService } from '../../services/notes-service';
import { NotesStore } from '../../store/notes-store';
import { TemplatesStore } from '../../store/templates-store';

@Component({
  selector: 'app-notes-page',
  imports: [
    TextEditorComponent,
    RouterLink,
  ],
  templateUrl: './notes-page.html',
  styleUrl: './notes-page.less'
})
export class NotesPage {
  readonly templatesStore = inject(TemplatesStore);
  readonly notesStore = inject(NotesStore);

  readonly notesService = inject(NotesService);
  readonly currentNoteId = this.notesService.currentNoteId;
  readonly currentNote = this.notesService.currentNote;
}
