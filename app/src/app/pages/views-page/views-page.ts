import alasql from 'alasql';
import { Component, computed, inject, signal } from '@angular/core';
import { LayoutMain } from '../../components/layout-main/layout-main';
import { TemplatesStore } from '../../store/templates-store';
import { NotesStore } from '../../store/notes-store';
import { ViewTable } from '../../components/view-table/view-table';

@Component({
  selector: 'app-views-page',
  imports: [
    LayoutMain,
    ViewTable
  ],
  templateUrl: './views-page.html',
  styleUrl: './views-page.less'
})
export class ViewsPage {
  readonly templatesStore = inject(TemplatesStore);
  readonly notesStore = inject(NotesStore);

  query = signal(`
SELECT N.name as name, N.department, N.manager, T.name as template FROM notes N
LEFT JOIN templates T ON N.templateId = T.id
WHERE department='EDP'
    `);


  readonly output = computed(() => {
    const templates = this.templatesStore.templates();
    const notes = this.notesStore.notes();
    const query = this.query();

    if (!query) {
      return [];
    }

    // Register notes as a table
    alasql.tables['notes']= {
      data: notes.map(n => flattenNote(n))
    };
    alasql.tables['templates']= {
      data: templates
    };

    const res: any[] = alasql(query)
    return res;
  })

  onChangeQuery(event: any) {
    const value = event.target.value;

    this.query.set(value);
  }
}


function flattenNote(obj: any): any {
  const { fields, ...rest } = obj;
  
  if (!fields || !Array.isArray(fields)) {
    return obj;
  }
  
  const flattenedFields = fields.reduce((acc, field) => {
    if (field.name && field.hasOwnProperty('value')) {
      acc[field.name.toLowerCase()] = field.value;
    }
    return acc;
  }, {} as Record<string, any>);
  
  return {
    ...rest,
    ...flattenedFields
  };
}