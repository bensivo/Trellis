import { inject, Injectable } from "@angular/core";
import { TabService } from "../components/tab-container/tab-service";
import { TemplatePanel } from "../components/template-panel/template-panel";
import { TemplateFieldType } from "../models/template-interface";
import { TemplatesStore } from "../store/templates-store";

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  readonly templatesStore = inject(TemplatesStore);
  readonly tabService = inject(TabService);


  createNewTemplate() {
    const id = this.templatesStore.createTemplate({
      name: 'Untitled',
      fields: [
        {
          name: 'Date',
          type: TemplateFieldType.DATE,
        }
      ]
    });

    this.tabService.addTab('template' + id, 'New Template', TemplatePanel, {
      id: id
    });
  }
}