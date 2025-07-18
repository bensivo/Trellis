import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewsStore } from '../../store/views-store';
import { TabService } from '../tab-container/tab-service';
import { View } from '../../models/view-interface';
import { ViewsService } from '../../services/views-service';
import { ViewPanel } from '../view-panel/view-panel';
// import { ViewService } from '../../services/views-service';
// import { ViewsStore } from '../../store/views-store';
// import { TabService } from '../tab-container/tab-service';
// import { ViewPanel } from '../view-panel/view-panel';

@Component({
  selector: 'app-views-panel',
  imports: [ ],
  templateUrl: './views-panel.html',
  styleUrl: './views-panel.less'
})
export class ViewsPanel {
  readonly viewsStore = inject(ViewsStore);
  readonly viewsService = inject(ViewsService);
  readonly tabService = inject(TabService);


  onClickNewView() {
    const id = this.viewsService.create({
      name: 'Untitled'
    });

    this.tabService.addTab('view'+id, 'Untitled', ViewPanel, { 
      id: id
    });
  }

  onClickView(view: View) {
    this.tabService.addTab('view'+view.id, view.name, ViewPanel, { 
      id: view.id
    });
  }
}
