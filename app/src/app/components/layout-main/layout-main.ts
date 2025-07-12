import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { TabHeader } from '../tab-header/tab-header';
import { NotesPanel } from '../notes-panel/notes-panel';
import { TemplatesPanel } from '../templates-panel/templates-panel';
import { NewNotePanel } from '../new-note-panel/new-note-panel';
import { TabService } from '../tab-container/tab-service';

@Component({
  selector: 'app-layout-main',
  imports: [
    TabHeader,
    NotesPanel,
    TemplatesPanel,
  ],
  templateUrl: './layout-main.html',
  styleUrl: './layout-main.less'
})
export class LayoutMain {
  readonly tabService = inject(TabService);

  constructor() {
    // Listen for changes in active tab, and update sidePanel accordingly
    effect(() => {
      const tabs = this.tabService.tabs();
      const activeTab = tabs.find(tab => tab.active);
      if (!activeTab) {
        return;
      }

      if (activeTab.id.includes('note')) {
        this.sidePanel.set('notes');
        return;
      }

      if (activeTab.id.includes('template')) {
        this.sidePanel.set('templates');
        return;
      }
    })
  }

  sidePanel = signal('notes');

  onClickNav(item: string) {
    this.sidePanel.set(item);
  }
}
