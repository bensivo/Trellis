import { Component, computed, inject, Inject, Signal } from '@angular/core';
import { TextEditorComponent } from '../../components/text-editor/text-editor';
import { NotesStore } from '../../store/notes-store';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
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

  readonly route = inject(ActivatedRoute);
  readonly routeParams = toSignal(this.route.params, { initialValue: null });

  readonly currentNoteId: Signal<number | null> = computed(() => {
    const params = this.routeParams();
    if (params == null) {
      return null;
    }

    return +params['noteid'];
  });

  readonly currentNote: Signal<any | null> = computed(() => {
    const noteId = this.currentNoteId();
    const notes = this.notesStore.notes();

    if (noteId == null) {
      return null;
    }

    const note = notes.find(n => n.id == noteId);
    return note ?? null;
  })
}
