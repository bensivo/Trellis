import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TemplatesStore } from './store/templates-store';
import { TemplateFieldType } from './models/template-interface';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.less'
})
export class App {
  protected title = 'trellis-app';

  readonly router = inject(Router);
  readonly templatesStore = inject(TemplatesStore);

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Cmd+N on Mac or Ctrl+N on Windows/Linux
    if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
      event.preventDefault(); // Prevent browser's "New Window"
      this.router.navigate(['/new-note']);
    }

    // Cmd+T on Mac or Ctrl+T on Windows/Linux
    if ((event.metaKey || event.ctrlKey) && event.key === 't') {
      event.preventDefault(); // Prevent browser's "New Window"

      const id = this.templatesStore.createTemplate({
        name: 'Untitled',
        fields: [
          {
            name: 'Date',
            type: TemplateFieldType.DATE,
          }
        ]
      });

      this.router.navigate(['templates', id]);
    }
  }
}
