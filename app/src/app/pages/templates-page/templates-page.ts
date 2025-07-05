import { Component, computed, inject, Signal } from '@angular/core';
import { TemplatesStore } from '../../store/templates-store';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { Template } from '../../models/template-interface';

@Component({
  selector: 'app-templates-page',
  imports: [
    RouterLink,
  ],
  templateUrl: './templates-page.html',
  styleUrl: './templates-page.less'
})
export class TemplatesPage {
  readonly templatesStore = inject(TemplatesStore);

  readonly route = inject(ActivatedRoute);
  readonly routeParams = toSignal(this.route.params, { initialValue: null });

  readonly currentTemplateId: Signal<number|null> = computed(() => {
    const params = this.routeParams();
    if (params == null) {
      return null;
    }

    return +params['templateid'];
  });

  readonly currentTemplate: Signal<Template | null> = computed(() => {
    const templateId = this.currentTemplateId();
    const templates = this.templatesStore.templates();

    if (templateId == null) {
      return null;
    }

    const template = templates.find(t => t.id == templateId);
    return template ?? null;
  })

}
