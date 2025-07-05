import { NotesPage } from './pages/notes-page/notes-page';
import { Routes } from '@angular/router';
import { TemplatesPage } from './pages/templates-page/templates-page';
import { HomePage } from './pages/home-page/home-page';

export const routes: Routes = [
  {
    title: 'Home',
    path: '',
    component: HomePage,
  },
  {
    title: 'Notes',
    path: 'notes',
    component: NotesPage,
  },
  {
    title: 'Notes',
    path: 'notes/:noteid',
    component: NotesPage,
  },
  {
    title: 'Templates',
    path: 'templates',
    component: TemplatesPage,
  },
  {
    title: 'Templates',
    path: 'templates/:templateid',
    component: TemplatesPage,
  }
];
