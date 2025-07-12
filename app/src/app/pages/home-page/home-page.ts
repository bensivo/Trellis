import { Component, signal } from '@angular/core';
import { LayoutMain } from '../../components/layout-main/layout-main';
import { TabContainerComponent } from '../../components/tab-container/tab-container';

@Component({
  selector: 'app-home-page',
  imports: [
    LayoutMain,
    TabContainerComponent,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.less'
})
export class HomePage {

  sidePanel = signal('notes');
}
