import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LayoutMain } from '../../components/layout-main/layout-main';
import { Template, TemplateFieldType } from '../../models/template-interface';
import { TemplatesStore } from '../../store/templates-store';

@Component({
  selector: 'app-templates-page',
  imports: [
    RouterLink,
    LayoutMain,
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

  onChangeFieldName(index: number, event: Event) {
    const id = this.currentTemplateId();
    if (!id) {
      return;
    }

    const target: HTMLInputElement = (event as InputEvent).target as HTMLInputElement;
    const value = target.value;

    this.templatesStore.updateFieldName(id, index, value);
  }

  onChangeFieldType(index: number, event: Event) {
    const id = this.currentTemplateId();
    if (!id) {
      return;
    }

    const target: HTMLSelectElement = (event as InputEvent).target as HTMLSelectElement;
    const value = target.value;

    this.templatesStore.updateFieldType(id, index, value as TemplateFieldType);
  }
}
