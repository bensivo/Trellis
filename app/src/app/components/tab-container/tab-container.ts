// tab-container.component.ts
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { Component, inject } from '@angular/core';
import { TabService } from './tab-service';

@Component({
  selector: 'app-tab-container',
  standalone: true,
  imports: [PortalModule, DragDropModule ],
  templateUrl: 'tab-container.html',
  styleUrls: ['./tab-container.less'],
})
export class TabContainerComponent {
  readonly tabService = inject(TabService);
}

