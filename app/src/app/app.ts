import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NewNotePanel } from './components/new-note-panel/new-note-panel';
import { TabService } from './components/tab-container/tab-service';
import { Template, TemplateFieldType } from './models/template-interface';
import { PersistenceService } from './services/persistence-service';
import { TemplateService } from './services/templates-service';
import { NotesStore } from './store/notes-store';
import { TemplatesStore } from './store/templates-store';

import * as mockData from './mock-data.json';
import { Note } from './models/note-interface';
import { ViewsStore } from './store/views-store';
import { View } from './models/view-interface';
import { AddLinkModalService } from './services/add-link-modal-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.less'
})
export class App {
  protected title = 'trellis-app';

  readonly router = inject(Router);
  readonly notesStore = inject(NotesStore);
  readonly templatesStore = inject(TemplatesStore);
  readonly viewsStore = inject(ViewsStore);
  readonly templateService = inject(TemplateService);
  readonly persistenceService = inject(PersistenceService);
  readonly tabService = inject(TabService);
  readonly addlinkModalService = inject(AddLinkModalService);

  constructor() {
    // Set the tab service on the window object, so we can access it from 
    // outside of Angular components (namely, our custom Lexical elements)
    (window as any).tabService = this.tabService;
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Cmd+N on Mac or Ctrl+N on Windows/Linux
    if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
      event.preventDefault(); // Prevent browser's "New Window"
      this.tabService.addTab('newnote', 'New Note', NewNotePanel, {});
    }

    // Cmd+T on Mac or Ctrl+T on Windows/Linux
    if ((event.metaKey || event.ctrlKey) && event.key === 't') {
      event.preventDefault(); // Prevent browser's "New Window"
      this.templateService.createNewTemplate();
    }

    // 
    // Developer debugger commands
    //
    // Cmd+Shift+1 - Clear all state
    if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === '1') {
      event.preventDefault(); 

      this.templatesStore.set([]);
      this.notesStore.set([]);
    }
    // Cmd+Shift+2 - Load seed data
    if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === '2') {
      event.preventDefault(); 

      this.templatesStore.set(mockData.templates as Template[]);
      this.notesStore.set(mockData.notes as Note[]);
      this.viewsStore.set(mockData.views as View[]);
    }
  }
}
