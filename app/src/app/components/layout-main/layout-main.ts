import { Component, effect, inject, signal } from '@angular/core';
import { NotesPanel } from '../notes-panel/notes-panel';
import { TabService } from '../tab-container/tab-service';
import { TabHeader } from '../tab-header/tab-header';
import { TemplatesPanel } from '../templates-panel/templates-panel';
import { CdkDrag, CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-layout-main',
  imports: [
    TabHeader,
    NotesPanel,
    TemplatesPanel,
    CdkDrag,
  ],
  templateUrl: './layout-main.html',
  styleUrl: './layout-main.less'
})
export class LayoutMain {
  readonly tabService = inject(TabService);

  minNavWidth = 200;
  sideNavWidth = this.minNavWidth; // TODO: make this persistent
  prevSideNavWidth = this.sideNavWidth;

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

  onResize(event: CdkDragMove) {
    this.sideNavWidth = Math.max(this.prevSideNavWidth + (event.distance.x), 200);
    event.source.reset();
  }

  onResizeEnd(event: CdkDragEnd) {
    this.prevSideNavWidth = this.sideNavWidth;
  }

}
