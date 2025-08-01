import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Template } from '../../models/template-interface';
import { TemplateService } from '../../services/templates-service';
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
  readonly templateService = inject(TemplateService);
  readonly templatesStore = inject(TemplatesStore);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly routeParams = toSignal(this.route.params, { initialValue: null });
  readonly tabService = inject(TabService);

  onClickNewTemplate() {
    this.templateService.createNewTemplate();
  }

  onClickTemplate(template: Template) {
    this.tabService.addTab('template'+template.id, template.name, TemplatePanel, { 
      id: template.id
    });
  }
}
