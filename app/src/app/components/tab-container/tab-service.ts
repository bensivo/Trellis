
// tab.service.ts
import { Injectable, ComponentRef, ViewContainerRef, signal } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { BehaviorSubject } from 'rxjs';

export interface Tab {
  id: string;
  title: string;
  portal: ComponentPortal<any>;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class TabService {
  // private tabs = new BehaviorSubject<Tab[]>([]);
  // tabs$ = this.tabs.asObservable();
  tabs = signal<Tab[]>([]);

  addTab(id: string, title: string, component: any, data?: any): void {
    const portal = new ComponentPortal(component);
    
    const tab: Tab = {
      id,
      title,
      portal,
      active: false,
    };

    const currentTabs = this.tabs();
    // Deactivate all tabs
    currentTabs.forEach(t => t.active = false);
    
    // Add new active tab
    tab.active = true;
    this.tabs.set([...currentTabs, tab]);
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