
// tab.service.ts
import { Injectable, ComponentRef, ViewContainerRef, signal, Injector, inject, InjectionToken } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';

export const TAB_DATA = new InjectionToken('TAB_DATA');

export interface Tab {
  id: string;
  title: string;
  portal: ComponentPortal<any>;
  active: boolean;
  data: TabData;
}

export interface TabData {
  id?: number;
}

@Injectable({ providedIn: 'root' })
export class TabService {
  readonly injector = inject(Injector)
  tabs = signal<Tab[]>([]);

  addTab(id: string, title: string, component: any, data: TabData, setActive: boolean = true): void {
    // Check for duplicate tabs
    const tabs = this.tabs();
    const exists = tabs.find(t => t.id === id);
    if (exists) {
      this.activateTab(id);
      return;
    }

    // Create custom injector to pass data to the portal component
    const customInjector = Injector.create({
      providers: [
        { provide: TAB_DATA, useValue: data }
      ],
      parent: this.injector
    });
    const portal = new ComponentPortal(component, null, customInjector);

    const tab: Tab = {
      id,
      title,
      portal,
      active: false,
      data: data,
    };
    const currentTabs = this.tabs();

    if (setActive) {
      currentTabs.forEach(t => t.active = false);
      tab.active = true;
    }

    this.tabs.set([...currentTabs, tab]);
  }

  updateTabTitle(id: string, title: string): void {
    const tabs = this.tabs();
    this.tabs.set(tabs.map(t => t.id === id ? { ...t, title } : t));
  }

  closeTab(id: string): void {
    const currentTabs = this.tabs().filter(tab => tab.id !== id);

    // If we closed the active tab, activate the last one
    if (currentTabs.length > 0 && !currentTabs.some(t => t.active)) {
      currentTabs[currentTabs.length - 1].active = true;
    }

    this.tabs.set(currentTabs);
  }

  activateTab(id: string): void {
    const currentTabs = this.tabs().map(tab => ({
      ...tab,
      active: tab.id === id
    }));
    this.tabs.set(currentTabs);
  }

  reorderTabs(fromIndex: number, toIndex: number): void {
    const currentTabs = [...this.tabs()];
    const [movedTab] = currentTabs.splice(fromIndex, 1);
    currentTabs.splice(toIndex, 0, movedTab);
    this.tabs.set(currentTabs);
  }
}