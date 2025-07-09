import { NotesPage } from './pages/notes-page/notes-page';
import { Routes } from '@angular/router';
import { TemplatesPage } from './pages/templates-page/templates-page';
import { HomePage } from './pages/home-page/home-page';
import { NewNotePage } from './pages/new-note-page/new-note-page';
import { ViewsPage } from './pages/views-page/views-page';

export const routes: Routes = [
  {
    title: 'Home',
    path: '',
    component: HomePage,
  },
  // {
  //   title: 'Notes',
  //   path: 'notes',
  //   component: NotesPage,
  // },
  // {
  //   title: 'Notes',
  //   path: 'notes/:noteid',
  //   component: NotesPage,
  // },
  // {
  //   title: 'New Note',
  //   path: 'new-note',
  //   component: NewNotePage,
  // },
  // {
  //   title: 'Templates',
  //   path: 'templates',
  //   component: TemplatesPage,
  // },
  // {
  //   title: 'Templates',
  //   path: 'templates/:templateid',
  //   component: TemplatesPage,
  // },
  // {
  //   title: 'Views',
  //   path: 'views',
  //   component: ViewsPage,
  // }
];
