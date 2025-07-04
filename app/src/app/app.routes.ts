import { Homepage } from './pages/homepage/homepage';
import { Schemaspage } from './pages/schemaspage/schemaspage';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    title: 'Notes',
    path: '',
    component: Homepage,
  },
  {
    title: 'Schemas',
    path: 'schemas',
    component: Schemaspage,
  }
];
