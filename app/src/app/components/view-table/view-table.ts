import { Component, computed, inject, input } from '@angular/core';
import { NotesStore } from '../../store/notes-store';
import { TabService } from '../tab-container/tab-service';
import { NotePanel } from '../note-panel/note-panel';

@Component({
  selector: 'app-view-table',
  imports: [
  ],
  templateUrl: './view-table.html',
  styleUrl: './view-table.less'
})
export class ViewTable {
  data = input.required<any[]>();

  readonly notesStore = inject(NotesStore);
  readonly notes = this.notesStore.notes;
  readonly tabService = inject(TabService);
  
  readonly columns = computed(() => {
    const items = this.data();
    if (!items.length) return [];
    
    // Get all unique keys from all objects
    const allKeys = new Set<string>();
    items.forEach(item => {
      Object.keys(item).forEach(key => allKeys.add(key));
    });
    
    return Array.from(allKeys);
  });
  
  getValue(obj: any, key: string): any {
    return obj[key] ?? '';
  }

  isLink(row: any, col: any) {
    const value =  row[col] ?? '';
    try {
      const isLink = value.split('-')[0] === 'link';
      return isLink;
    } catch(e) {
      return false;
    }
  }

  linkName(row: any, col: any) {
    const value =  row[col] ?? '';
    const noteId = +value.split('-')[1];

    const note = this.notes().find(n => n.id === noteId);
    if (!note) {
      return 'Unknown';
    } else {
      return note.name;
    }
  }

  onClickLink(row: any, col: any) {
    const value =  row[col] ?? '';
    const noteId = +value.split('-')[1];

    const note = this.notes().find(n => n.id === noteId);
    if (!note) {
      return;
    }

    this.tabService.addTab('note'+note.id, note.name, NotePanel, {
      id: note.id
    }, false)

  }
}