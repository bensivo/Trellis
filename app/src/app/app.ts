import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TemplateFieldType } from './models/template-interface';
import { PersistenceService } from './services/persistence-service';
import { TemplatesStore } from './store/templates-store';
import { NotesStore } from './store/notes-store';

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
  readonly persistenceService = inject(PersistenceService);

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Cmd+N on Mac or Ctrl+N on Windows/Linux
    if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
      event.preventDefault(); // Prevent browser's "New Window"
      this.router.navigate(['/new-note']);
    }

    // Cmd+T on Mac or Ctrl+T on Windows/Linux
    if ((event.metaKey || event.ctrlKey) && event.key === 't') {
      event.preventDefault(); // Prevent browser's "New Window"

      const id = this.templatesStore.createTemplate({
        name: 'Untitled',
        fields: [
          {
            name: 'Date',
            type: TemplateFieldType.DATE,
          }
        ]
      });

      this.router.navigate(['templates', id]);
    }

    /**
     * Developer debugger commands
     */

    // Cmd+Shift+1 - Clear all state
    if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === '1') {
      event.preventDefault(); 

      this.templatesStore.set([]);
      this.notesStore.set([]);
    }

    // Cmd+Shift+2 - Load seed data
    if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === '2') {
      event.preventDefault(); 

      this.templatesStore.set([ { id: 0, name: 'Person', fields: [ { name: "Department", type: TemplateFieldType.TEXT, }, { name: "Manager", type: TemplateFieldType.TEXT, }, ], content: { "root": { "children": [{ "children": [{ "detail": 0, "format": 0, "mode": "normal", "style": "", "text": "Responsibilities:", "type": "text", "version": 1 }], "direction": "ltr", "format": "", "indent": 0, "type": "heading", "version": 1, "tag": "h2" }, { "children": [{ "children": [], "direction": null, "format": "", "indent": 0, "type": "listitem", "version": 1, "value": 1 }], "direction": null, "format": "", "indent": 0, "type": "list", "version": 1, "listType": "bullet", "start": 1, "tag": "ul" }, { "children": [], "direction": null, "format": "", "indent": 0, "type": "paragraph", "version": 1, "textFormat": 0, "textStyle": "" }, { "children": [{ "detail": 0, "format": 0, "mode": "normal", "style": "", "text": "Notes:", "type": "text", "version": 1 }], "direction": "ltr", "format": "", "indent": 0, "type": "heading", "version": 1, "tag": "h2" }, { "children": [{ "children": [], "direction": null, "format": "", "indent": 0, "type": "listitem", "version": 1, "value": 1 }], "direction": null, "format": "", "indent": 0, "type": "list", "version": 1, "listType": "bullet", "start": 1, "tag": "ul" }, { "children": [], "direction": null, "format": "", "indent": 0, "type": "paragraph", "version": 1, "textFormat": 0, "textStyle": "" }], "direction": "ltr", "format": "", "indent": 0, "type": "root", "version": 1 } }, }, { id: 1, name: 'Segment', fields: [ { name: "Created Date", type: TemplateFieldType.DATE, }, ], content: { "root": { "children": [{ "children": [{ "detail": 0, "format": 0, "mode": "normal", "style": "", "text": "Description", "type": "text", "version": 1 }], "direction": "ltr", "format": "", "indent": 0, "type": "heading", "version": 1, "tag": "h2" }, { "children": [{ "detail": 0, "format": 0, "mode": "normal", "style": "", "text": "Lorem Ipsum", "type": "text", "version": 1 }], "direction": "ltr", "format": "", "indent": 0, "type": "paragraph", "version": 1, "textFormat": 0, "textStyle": "" }, { "children": [], "direction": null, "format": "", "indent": 0, "type": "paragraph", "version": 1, "textFormat": 0, "textStyle": "" }, { "children": [{ "detail": 0, "format": 0, "mode": "normal", "style": "", "text": "People", "type": "text", "version": 1 }], "direction": "ltr", "format": "", "indent": 0, "type": "heading", "version": 1, "tag": "h2" }, { "children": [{ "children": [], "direction": null, "format": "", "indent": 0, "type": "listitem", "version": 1, "value": 1 }], "direction": null, "format": "", "indent": 0, "type": "list", "version": 1, "listType": "bullet", "start": 1, "tag": "ul" }, { "children": [], "direction": null, "format": "", "indent": 0, "type": "paragraph", "version": 1, "textFormat": 0, "textStyle": "" }], "direction": "ltr", "format": "", "indent": 0, "type": "root", "version": 1 } }, } ]);
      this.notesStore.set( [ { id: 0, templateId: 0, name: 'Kyle', fields: [ { name: 'Department', type: TemplateFieldType.TEXT, value: 'EDP', }, { name: 'Manager', type: TemplateFieldType.TEXT, value: 'Shahmeer', }, ], content: { "root": { "children": [{ "children": [{ "detail": 0, "format": 0, "mode": "normal", "style": "", "text": "Responsibilities:", "type": "text", "version": 1 }], "direction": "ltr", "format": "", "indent": 0, "type": "heading", "version": 1, "tag": "h2" }, { "children": [{ "children": [], "direction": null, "format": "", "indent": 0, "type": "listitem", "version": 1, "value": 1 }], "direction": null, "format": "", "indent": 0, "type": "list", "version": 1, "listType": "bullet", "start": 1, "tag": "ul" }, { "children": [], "direction": null, "format": "", "indent": 0, "type": "paragraph", "version": 1, "textFormat": 0, "textStyle": "" }, { "children": [{ "detail": 0, "format": 0, "mode": "normal", "style": "", "text": "Notes:", "type": "text", "version": 1 }], "direction": "ltr", "format": "", "indent": 0, "type": "heading", "version": 1, "tag": "h2" }, { "children": [{ "children": [], "direction": null, "format": "", "indent": 0, "type": "listitem", "version": 1, "value": 1 }], "direction": null, "format": "", "indent": 0, "type": "list", "version": 1, "listType": "bullet", "start": 1, "tag": "ul" }, { "children": [], "direction": null, "format": "", "indent": 0, "type": "paragraph", "version": 1, "textFormat": 0, "textStyle": "" }], "direction": "ltr", "format": "", "indent": 0, "type": "root", "version": 1 } }, }, { id: 1, templateId: 0, name: 'Ben', fields: [ { name: 'Department', type: TemplateFieldType.TEXT, value: 'EDP', }, { name: 'Manager', type: TemplateFieldType.TEXT, value: 'Ganesh', }, ], content: { "root": { "children": [{ "children": [{ "detail": 0, "format": 0, "mode": "normal", "style": "", "text": "Responsibilities:", "type": "text", "version": 1 }], "direction": "ltr", "format": "", "indent": 0, "type": "heading", "version": 1, "tag": "h2" }, { "children": [{ "children": [], "direction": null, "format": "", "indent": 0, "type": "listitem", "version": 1, "value": 1 }], "direction": null, "format": "", "indent": 0, "type": "list", "version": 1, "listType": "bullet", "start": 1, "tag": "ul" }, { "children": [], "direction": null, "format": "", "indent": 0, "type": "paragraph", "version": 1, "textFormat": 0, "textStyle": "" }, { "children": [{ "detail": 0, "format": 0, "mode": "normal", "style": "", "text": "Notes:", "type": "text", "version": 1 }], "direction": "ltr", "format": "", "indent": 0, "type": "heading", "version": 1, "tag": "h2" }, { "children": [{ "children": [], "direction": null, "format": "", "indent": 0, "type": "listitem", "version": 1, "value": 1 }], "direction": null, "format": "", "indent": 0, "type": "list", "version": 1, "listType": "bullet", "start": 1, "tag": "ul" }, { "children": [], "direction": null, "format": "", "indent": 0, "type": "paragraph", "version": 1, "textFormat": 0, "textStyle": "" }], "direction": "ltr", "format": "", "indent": 0, "type": "root", "version": 1 } }, }, { id: 2, templateId: 1, name: 'Matt', fields: [ { name: 'Department', type: TemplateFieldType.TEXT, value: 'RND', }, { name: 'Manager', type: TemplateFieldType.TEXT, value: 'Shahmeer', }, ], content: { "root": { "children": [{ "children": [{ "detail": 0, "format": 0, "mode": "normal", "style": "", "text": "Responsibilities:", "type": "text", "version": 1 }], "direction": "ltr", "format": "", "indent": 0, "type": "heading", "version": 1, "tag": "h2" }, { "children": [{ "children": [], "direction": null, "format": "", "indent": 0, "type": "listitem", "version": 1, "value": 1 }], "direction": null, "format": "", "indent": 0, "type": "list", "version": 1, "listType": "bullet", "start": 1, "tag": "ul" }, { "children": [], "direction": null, "format": "", "indent": 0, "type": "paragraph", "version": 1, "textFormat": 0, "textStyle": "" }, { "children": [{ "detail": 0, "format": 0, "mode": "normal", "style": "", "text": "Notes:", "type": "text", "version": 1 }], "direction": "ltr", "format": "", "indent": 0, "type": "heading", "version": 1, "tag": "h2" }, { "children": [{ "children": [], "direction": null, "format": "", "indent": 0, "type": "listitem", "version": 1, "value": 1 }], "direction": null, "format": "", "indent": 0, "type": "list", "version": 1, "listType": "bullet", "start": 1, "tag": "ul" }, { "children": [], "direction": null, "format": "", "indent": 0, "type": "paragraph", "version": 1, "textFormat": 0, "textStyle": "" }], "direction": "ltr", "format": "", "indent": 0, "type": "root", "version": 1 } }, }, ]);
    }
  }
}
