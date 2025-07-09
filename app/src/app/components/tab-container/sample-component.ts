// sample-component.ts (example tab content)
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sample',
  standalone: true,
  template: `
    <div class="sample-content">
      <h3>Sample Tab Content</h3>
      <p>This is dynamic content rendered in a portal!</p>
      <textarea placeholder="Type something..."></textarea>
    </div>
  `,
  styles: [`
    .sample-content {
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    textarea {
      flex: 1;
      min-height: 200px;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  `]
})
export class SampleComponent {
  @Input() data?: any;
}