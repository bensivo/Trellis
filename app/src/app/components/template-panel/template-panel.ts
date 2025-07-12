import { Component, computed, effect, ElementRef, inject, Signal, ViewChild } from '@angular/core';
import { Template, TemplateFieldType } from '../../models/template-interface';
import { TemplatesStore } from '../../store/templates-store';
import { TAB_DATA, TabData, TabService } from '../tab-container/tab-service';
import { TemplateTextEditor } from '../template-text-editor/template-text-editor';

@Component({
  selector: 'app-template-panel',
  imports: [
    TemplateTextEditor,
  ],
  templateUrl: './template-panel.html',
  styleUrl: './template-panel.less'
})
export class TemplatePanel {
  readonly data: TabData = inject(TAB_DATA) as TabData;
  readonly tabService = inject(TabService);
  readonly templatesStore = inject(TemplatesStore);
  readonly currentTemplate: Signal<Template | null> = computed(() => {
    const templateId = this.data.id;
    const templates = this.templatesStore.templates();

    if (templateId == null) {
      return null;
    }

    const template = templates.find(t => t.id == templateId);
    return template ?? null;
  })

  prevTemplateId: number | null = null
  constructor() {
    effect(() => {
      const templateId = this.currentTemplate();

      if (templateId !== this.prevTemplateId) {
        const template = this.currentTemplate();
        if (template && template.name === 'Untitled' && this.titleInput) {
          this.titleInput.nativeElement.select();
        }
      }
    })
  }

  @ViewChild('templatetitle') titleInput!: ElementRef<HTMLInputElement>;
  ngAfterViewInit() {
    setTimeout(() => {
      // Becuase we're using hash-routers, the "autofocus" on the input element doesn't work all the time
      // We add the manual call to focus() in afterViewInit as a workaround

      // Focus title, but only on brand new notes
      const template = this.currentTemplate();
      if (template && template.name === 'Untitled') {
        this.titleInput.nativeElement.select();
      }
    }, 0);
  }

  onChangeFieldName(index: number, event: Event) {
    const template = this.currentTemplate();
    if (!template) {
      return;
    }

    const target: HTMLInputElement = (event as InputEvent).target as HTMLInputElement;
    const value = target.value;

    this.templatesStore.updateFieldName(template.id, index, value);
  }

  onChangeFieldType(index: number, event: Event) {
    const template = this.currentTemplate();
    if (!template) {
      return;
    }

    const target: HTMLSelectElement = (event as InputEvent).target as HTMLSelectElement;
    const value = target.value;

    this.templatesStore.updateFieldType(template.id, index, value as TemplateFieldType);
  }

  onChangeName(event: any) {
    const template = this.currentTemplate();
    if (!template) {
      return;
    }
    const value = event.target.value;
    this.templatesStore.updateTemplateName(template.id, value);
    this.tabService.updateTabTitle('template' + template.id, value);
  }

  onClickNewField() {
    const template = this.currentTemplate();
    if (!template) {
      return;
    }

    this.templatesStore.addField(template.id)
  }

  onClickDeleteField(index: number) {
    const template = this.currentTemplate();
    if (!template) {
      return;
    }

    this.templatesStore.removeField(template.id, index)
  }

  onClickMoveFieldUp(index: number) {
    const template = this.currentTemplate();
    if (!template) {
      return;
    }

    this.templatesStore.moveFieldUp(template.id, index)
  }

  onClickMoveFieldDown(index: number) {
    const template = this.currentTemplate();
    if (!template) {
      return;
    }

    this.templatesStore.moveFieldDown(template.id, index)
  }

  onClickDeleteTemplate() {
    const template = this.currentTemplate();
    if (!template) {
      return;
    }

    this.templatesStore.deleteTemplate(template.id);
    this.tabService.closeTab('template' + template.id);
  }
}
