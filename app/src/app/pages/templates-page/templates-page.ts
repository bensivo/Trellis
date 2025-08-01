import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutMain } from '../../components/layout-main/layout-main';
import { TemplatePanel } from '../../components/template-panel/template-panel';
import { TemplatesPanel } from '../../components/templates-panel/templates-panel';
import { Template } from '../../models/template-interface';
import { TemplatesStore } from '../../store/templates-store';

@Component({
  selector: 'app-templates-page',
  imports: [
    LayoutMain,
    TemplatePanel,
    TemplatesPanel,
  ],
  templateUrl: './templates-page.html',
  styleUrl: './templates-page.less'
})
export class TemplatesPage {
  readonly templatesStore = inject(TemplatesStore);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly routeParams = toSignal(this.route.params, { initialValue: null });

  readonly currentTemplateId: Signal<number | null> = computed(() => {
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

