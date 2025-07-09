import { Component, signal } from '@angular/core';
import { LayoutMain } from '../../components/layout-main/layout-main';
import { TabContainerComponent } from '../../components/tab-container/tab-container';
import { NotesPanel } from '../../components/notes-panel/notes-panel';
import { TemplatesPanel } from '../../components/templates-panel/templates-panel';

@Component({
  selector: 'app-home-page',
  imports: [
    LayoutMain,
    TabContainerComponent,
    NotesPanel,
    TemplatesPanel,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.less'
})
export class HomePage {

  sidePanel = signal('notes');
}
