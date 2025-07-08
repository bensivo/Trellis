import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-view-table',
  imports: [
  ],
  templateUrl: './view-table.html',
  styleUrl: './view-table.less'
})
export class ViewTable {
  data = input.required<any[]>();
  
  readonly columns = computed(() => {
    const items = this.data();
    if (!items.length) return [];
    
    // Get all unique keys from all objects
    const allKeys = new Set<string>();
    items.forEach(item => {
      Object.keys(item).forEach(key => allKeys.add(key));
    });
    
    return Array.from(allKeys);
  });
  
  getValue(obj: any, key: string): any {
    return obj[key] ?? '';
  }
}