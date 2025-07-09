import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { TabHeader } from '../tab-header/tab-header';
import { NotesPanel } from '../notes-panel/notes-panel';
import { TemplatesPanel } from '../templates-panel/templates-panel';

@Component({
  selector: 'app-layout-main',
  imports: [
    RouterLink,
    TabHeader,
    NotesPanel,
    TemplatesPanel,
  ],
  templateUrl: './layout-main.html',
  styleUrl: './layout-main.less'
})
export class LayoutMain {
  readonly router = inject(Router);
  readonly url = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  sidePanel = signal('notes');

  onClickNav(item: string) {
    this.sidePanel.set(item);
  }
}
