import { Component, computed, effect, ElementRef, HostListener, inject, OnChanges, signal, SimpleChanges, ViewChild } from '@angular/core';
import { AddLinkModalService } from '../../services/add-link-modal-service';
import { NotesStore } from '../../store/notes-store';

@Component({
  selector: 'app-add-link-modal',
  imports: [],
  templateUrl: './add-link-modal.html',
  styleUrl: './add-link-modal.less'
})
export class AddLinkModal {
  readonly notesStore = inject(NotesStore);
  readonly svc = inject(AddLinkModalService);

  @ViewChild('notesearch') searchInput!: ElementRef<HTMLInputElement>;

  constructor() {
    effect(() => {
      const isVisible = this.svc.isVisible();
      if (isVisible) {
        // Reset search value when modal opens
        this.searchValue.set('');

        setTimeout(() => {
          this.searchInput.nativeElement.focus();
        }, 0)
      }
    })
  }

  searchValue = signal('');
  orderedNotes = computed(() => {
    const notes = [...this.notesStore.notes()];
    const searchValue = this.searchValue();

    notes.sort((a, b) => {
      const similarityA = jaroWinklerSimilarity(a.name, searchValue);
      const similarityB = jaroWinklerSimilarity(b.name, searchValue);
      return similarityB - similarityA;
    })

    // Limit to top 10
    return notes.slice(0, 7);
  });

 
  onChangeSearch(event: any) {
    const value = event.target.value;
    this.searchValue.set(value);
  }

  onSubmitModal(event: any) {
    event.preventDefault();
    const orderedNotes = this.orderedNotes();
    if (orderedNotes.length === 0) {
      console.warn("No notes found for the search term");
      return;
    }

    const selectedNote = orderedNotes[0]; // Get the top result
    if (selectedNote) {
      this.svc.callback(selectedNote.id, selectedNote.name);
    }

    this.svc.closeAddLinkModal();
  }

  onClickButton(event: any, index: number) {
    event.preventDefault();

    const orderedNotes = this.orderedNotes();
    if (index < 0 || index >= orderedNotes.length) {
      console.warn("Index out of bounds for ordered notes");
      return;
    }

    const selectedNote = orderedNotes[index];
    if (selectedNote) {
      this.svc.callback(selectedNote.id, selectedNote.name);
    }

    this.svc.closeAddLinkModal();
  }

  onClickOutsideModal(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const modal = document.getElementById('add-link-modal');

    if (modal && !modal.contains(target)) {
      this.svc.closeAddLinkModal();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.svc.closeAddLinkModal();
    }
  }
}

// Disclaimer: Claude wrote this code, but it works good enough for me
function jaroWinklerSimilarity(s1: string, s2: string): number {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  if (s1 === s2) return 1.0;

  const len1 = s1.length;
  const len2 = s2.length;
  const matchWindow = Math.floor(Math.max(len1, len2) / 2) - 1;

  const matches1 = new Array(len1).fill(false);
  const matches2 = new Array(len2).fill(false);

  let matches = 0;
  let transpositions = 0;

  // Find matches
  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchWindow);
    const end = Math.min(i + matchWindow + 1, len2);

    for (let j = start; j < end; j++) {
      if (matches2[j] || s1[i] !== s2[j]) continue;
      matches1[i] = matches2[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0.0;

  // Count transpositions
  let k = 0;
  for (let i = 0; i < len1; i++) {
    if (!matches1[i]) continue;
    while (!matches2[k]) k++;
    if (s1[i] !== s2[k]) transpositions++;
    k++;
  }

  const jaro = (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3;

  // Winkler modification
  let prefix = 0;
  for (let i = 0; i < Math.min(len1, len2, 4); i++) {
    if (s1[i] === s2[i]) prefix++;
    else break;
  }

  return jaro + (0.1 * prefix * (1 - jaro));
}