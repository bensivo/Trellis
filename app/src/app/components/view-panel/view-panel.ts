import { Component, computed, ElementRef, inject, ViewChild } from '@angular/core';
import { ViewsService } from '../../services/views-service';
import { TemplatesStore } from '../../store/templates-store';
import { ViewsStore } from '../../store/views-store';
import { TAB_DATA, TabData, TabService } from '../tab-container/tab-service';

@Component({
  selector: 'app-view-panel',
  imports: [
  ],
  templateUrl: './view-panel.html',
  styleUrl: './view-panel.less'
})
export class ViewPanel {
  readonly data: TabData = inject(TAB_DATA) as TabData;

  readonly templatesStore = inject(TemplatesStore);
  readonly viewsStore = inject(ViewsStore);
  readonly viewsService = inject(ViewsService);
  readonly tabService = inject(TabService);

  readonly currentView = computed(() => {
    const views = this.viewsStore.views();
    const view =  views.find(n => n.id === this.data.id);
    if (!view) {
      return null;
    }

    return view;
  })

  @ViewChild('viewtitle') titleInput!: ElementRef<HTMLInputElement>;
  ngAfterViewInit() {
    setTimeout(() => {
      // Becuase we're using hash-routers, the "autofocus" on the input element doesn't work all the time
      // We add the manual call to focus() in afterViewInit as a workaround

      // Focus title, but only on brand new views
      const view = this.currentView();
      if (view && view.name === 'Untitled') {
        this.titleInput.nativeElement.select();
      }

    }, 0);
  }

  onFieldChange(index: number, event: Event) {
    const view = this.currentView();
    if (view === null) {
      return;
    }

    const target: HTMLInputElement = (event as InputEvent).target as HTMLInputElement;
    const value = target.value;

    // this.viewsStore.updateViewField(view.id, index, value);
  }

  onChangeTitle(event: any) {
    const view = this.currentView();
    if (view === null) {
      return;
    }

    const value = event.target.value;
    this.viewsService.update(view.id, { 
      name: value 
    });
    this.tabService.updateTabTitle('view' + view.id, value);
  }

  onClickDeleteView() {
    const view = this.currentView();
    if (view === null) {
      return;
    }

    this.viewsService.delete(view.id);
    this.tabService.closeTab('view' + view.id);
  }
}
