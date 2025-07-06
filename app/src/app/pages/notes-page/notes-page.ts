import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TextEditor } from '../../components/text-editor/text-editor';
import { NotesService } from '../../services/notes-service';
import { NotesStore } from '../../store/notes-store';
import { TemplatesStore } from '../../store/templates-store';
import { LayoutMain } from '../../components/layout-main/layout-main';

@Component({
  selector: 'app-notes-page',
  imports: [
    TextEditor,
    RouterLink,
    LayoutMain,
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

  onFieldChange(index: number, event: Event) {
    const currentNoteId = this.currentNoteId();
    if (!currentNoteId) {
      return;;
    }

    const target: HTMLInputElement = (event as InputEvent).target as HTMLInputElement;
    const value = target.value;

    this.notesStore.updateNoteField(currentNoteId, index, value);
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Cmd+N on Mac or Ctrl+N on Windows/Linux
    if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
      event.preventDefault(); // Prevent browser's "New Window"
      this.router.navigate(['/new-note']);
    }
  }
}
