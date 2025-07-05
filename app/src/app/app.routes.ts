import { NotesPage } from './pages/notes-page/notes-page';
import { Routes } from '@angular/router';
import { SchemasPage } from './pages/schemas-page/schemas-page';

export const routes: Routes = [
  {
    title: 'Notes',
    path: '',
    component: NotesPage,
  },
  {
    title: 'Schemas',
    path: 'schemas',
    component: SchemasPage,
  }
];
