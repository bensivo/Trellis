import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, inject } from '@angular/core';
import { SampleComponent } from '../tab-container/sample-component';
import { TabService, Tab } from '../tab-container/tab-service';
import { PortalModule } from '@angular/cdk/portal';

@Component({
  selector: 'app-tab-header',
  imports: [PortalModule, DragDropModule ],
  templateUrl: './tab-header.html',
  styleUrl: './tab-header.less'
})
export class TabHeader {
  tabService = inject(TabService);

  onTabDrop(event: CdkDragDrop<Tab[]>): void {
    this.tabService.reorderTabs(event.previousIndex, event.currentIndex);
  }

  closeTab(event: Event, tabId: string): void {
    event.stopPropagation();
    this.tabService.closeTab(tabId);
  }

  trackByTab(index: number, tab: Tab): string {
    return tab.id;
  }

  addSampleTab(): void {
    const id = `tab-${Date.now()}`;
    // You'd replace SampleComponent with your actual component
    this.tabService.addTab(id, `Tab ${id.slice(-4)}`, SampleComponent);
  }
}
