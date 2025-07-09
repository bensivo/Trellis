// tab-container.component.ts
import { Component, inject } from '@angular/core';
import { CdkPortalOutlet, PortalModule } from '@angular/cdk/portal';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { TabService, Tab } from './tab-service';
import { SampleComponent } from './sample-component';

@Component({
  selector: 'app-tab-container',
  standalone: true,
  imports: [PortalModule, DragDropModule, NgFor, NgIf, AsyncPipe],
  templateUrl: 'tab-container.html',
  styleUrls: ['./tab-container.less'],
})
export class TabContainerComponent {
  readonly tabService = inject(TabService);

//   onTabDrop(event: CdkDragDrop<Tab[]>): void {
//     this.tabService.reorderTabs(event.previousIndex, event.currentIndex);
//   }

//   closeTab(event: Event, tabId: string): void {
//     event.stopPropagation();
//     this.tabService.closeTab(tabId);
//   }

//   trackByTab(index: number, tab: Tab): string {
//     return tab.id;
//   }

//   addSampleTab(): void {
//     const id = `tab-${Date.now()}`;
//     // You'd replace SampleComponent with your actual component
//     this.tabService.addTab(id, `Tab ${id.slice(-4)}`, SampleComponent);
//   }
}

