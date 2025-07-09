import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Template, TemplateFieldType } from '../../models/template-interface';
import { TemplatesStore } from '../../store/templates-store';
import { TabService } from '../tab-container/tab-service';
import { TemplatePanel } from '../template-panel/template-panel';

@Component({
  selector: 'app-templates-panel',
  imports: [ ],
  templateUrl: './templates-panel.html',
  styleUrl: './templates-panel.less'
})
export class TemplatesPanel {
  readonly templatesStore = inject(TemplatesStore);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly routeParams = toSignal(this.route.params, { initialValue: null });
  readonly tabService = inject(TabService);

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

  onClickNewTemplate() {
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

  onClickTemplate(template: Template) {
    this.tabService.addTab('template'+template.id, template.name, TemplatePanel, { 
      id: template.id
    });
  }
}
