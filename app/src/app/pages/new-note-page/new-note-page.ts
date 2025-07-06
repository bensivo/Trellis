import { AfterViewInit, Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutMain } from '../../components/layout-main/layout-main';
import { NotesService } from '../../services/notes-service';
import { NotesStore } from '../../store/notes-store';
import { TemplatesStore } from '../../store/templates-store';
import { NotesPanel } from '../../components/notes-panel/notes-panel';
import { TemplateFieldType } from '../../models/template-interface';

@Component({
  selector: 'app-new-note-page',
  imports: [
    LayoutMain,
    NotesPanel,
  ],
  templateUrl: './new-note-page.html',
  styleUrl: './new-note-page.less'
})
export class NewNotePage implements AfterViewInit {
  readonly templatesStore = inject(TemplatesStore);
  readonly notesStore = inject(NotesStore);
  readonly notesService = inject(NotesService);
  readonly router = inject(Router);

  // Re-order the templates in the list based on similarity with search term
  // similar to Obsidian's UX when selecting a template
  searchValue = signal('');
  orderedTemplates = computed(() => {
    const templates = this.templatesStore.templates();
    const searchValue = this.searchValue();

    templates.sort((a, b) => {
      const similarityA = jaroWinklerSimilarity(a.name, searchValue);
      const similarityB = jaroWinklerSimilarity(b.name, searchValue);
      return similarityB - similarityA;
    })

    return templates;
  });

  @ViewChild('templatesearch') searchInput!: ElementRef<HTMLInputElement>;
  ngAfterViewInit() {
    setTimeout(() => {
      // Becuase we're using hash-routers, the "autofocus" on the input element doesn't work all the time
      // We add the manual call to focus() in afterViewInit as a workaround
      this.searchInput.nativeElement.focus();
    }, 0);
  }

  onChangeSearch(event: any) {
    const value = event.target.value;
    this.searchValue.set(value);
  }

  onKeypress(event: any) {
    // Enter Key
    if (event.keyCode === 13) {
      this.onClickSubmit();
    }
  }

  onClickCancel() {
    this.router.navigate(['notes']);
  }

  onClickTemplateButton(index: number) {
    const template = this.orderedTemplates()[index];
    const id = this.notesStore.create({
      name: 'Untitled',
      templateId: template.id,
      fields: template.fields.map(f => ({
        name: f.name,
        type: f.type,
        value: '',
      })),
      content: template.content
    })

    this.router.navigate(['notes', id]);
  }

  onClickSubmit() {
    this.onClickTemplateButton(0);
  }

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
}

// Disclaimer: Claude wrote this code, but it works good enough for me
function jaroWinklerSimilarity(s1: string, s2: string): number {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  if (s1 === s2) return 1.0;

  const len1 = s1.length;
  const len2 = s2.length;
  const matchWindow = Math.floor(Math.max(len1, len2) / 2) - 1;

  const matches1 = new Array(len1).fill(false);
  const matches2 = new Array(len2).fill(false);

  let matches = 0;
  let transpositions = 0;

  // Find matches
  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchWindow);
    const end = Math.min(i + matchWindow + 1, len2);

    for (let j = start; j < end; j++) {
      if (matches2[j] || s1[i] !== s2[j]) continue;
      matches1[i] = matches2[j] = true;
      matches++;
      break;
    }
  }

  if (matches === 0) return 0.0;

  // Count transpositions
  let k = 0;
  for (let i = 0; i < len1; i++) {
    if (!matches1[i]) continue;
    while (!matches2[k]) k++;
    if (s1[i] !== s2[k]) transpositions++;
    k++;
  }

  const jaro = (matches / len1 + matches / len2 + (matches - transpositions / 2) / matches) / 3;

  // Winkler modification
  let prefix = 0;
  for (let i = 0; i < Math.min(len1, len2, 4); i++) {
    if (s1[i] === s2[i]) prefix++;
    else break;
  }

  return jaro + (0.1 * prefix * (1 - jaro));
}