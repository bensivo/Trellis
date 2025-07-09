import { AfterViewInit, Component, effect, inject, input, Signal } from '@angular/core';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { createEmptyHistoryState, registerHistory } from '@lexical/history';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { $isListItemNode, ListItemNode, ListNode } from '@lexical/list';
import { registerMarkdownShortcuts } from '@lexical/markdown';
import { HeadingNode, QuoteNode, registerRichText } from '@lexical/rich-text';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import { $createParagraphNode, $createTextNode, $getRoot, $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW, createEditor, INDENT_CONTENT_COMMAND, KEY_TAB_COMMAND, OUTDENT_CONTENT_COMMAND } from 'lexical';
import { Template } from '../../models/template-interface';
import { TemplatesStore } from '../../store/templates-store';
import { TemplatesService } from '../../services/templates-service';


@Component({
  selector: 'app-template-text-editor',
  imports: [],
  templateUrl: './template-text-editor.html',
  styleUrl: './template-text-editor.less'
})
export class TemplateTextEditor implements AfterViewInit {
  readonly templateId = input<number>();
  readonly templateStore = inject(TemplatesStore);
  readonly templatesService = inject(TemplatesService);
  readonly currentTemplateId: Signal<number | null> = this.templatesService.currentTemplateId;
  readonly currentTemplate: Signal<Template | null> = this.templatesService.currentTemplate;

  previousTemplateId: number | null = null;

  private editor: any;

  constructor() {
    effect(() => {
      // Listen for changes in the templateid, and load the new template
      const id = this.currentTemplateId();
      if (id !== null && id !== this.previousTemplateId) {
        this.previousTemplateId = id;
        this.loadTemplateFromId(id);
      }
    });
  }

  ngAfterViewInit() {
    const editorDiv = document.getElementById('template-text-editor');
    if (!editorDiv) {
      console.error("CAn't initialize lexical, div#template-text-editor not found");
      return;
    }

    this.editor = createEditor({
      namespace: 'MyEditor',
      nodes: [
        HeadingNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        AutoLinkNode,
        LinkNode,
        ListNode,
        ListItemNode,
      ],
      theme: {
        root: 'editor-root',
        paragraph: 'editor-paragraph',
        text: {
          bold: 'editor-text-bold',
          italic: 'editor-text-italic',
          underline: 'editor-text-underline',
          strikethrough: 'editor-text-strikethrough',
          code: 'editor-text-code',
        },
        heading: {
          h1: 'editor-heading-h1',
          h2: 'editor-heading-h2',
          h3: 'editor-heading-h3',
        },
        quote: 'editor-quote',
        list: {
          nested: {
            listitem: 'editor-nested-listitem',
          },
          ol: 'editor-list-ol',
          ul: 'editor-list-ul',
          listitem: 'editor-listitem',
        }
      },
      onError: (error: Error) => {
        console.error('Lexical error:', error);
      }
    });

    this.editor.setRootElement(editorDiv);

    mergeRegister(
      registerRichText(this.editor),
      registerHistory(this.editor, createEmptyHistoryState(), 300),
      registerMarkdownShortcuts(this.editor),

      // Handle Tab key
      this.editor.registerCommand(
        KEY_TAB_COMMAND,
        (event: any) => {
          event.preventDefault();
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            return true;
          }

          // Check if in list. If so, indent or outdent
          const anchor = selection.anchor.getNode();
          const listItem = $findMatchingParent(anchor, $isListItemNode);
          if (listItem) {
            if (event.shiftKey) {

              // See if this list item is root-level or not. If root, 'exit' the list by
              // converting the node to a paragraph
              if (listItem.getIndent() == 0) {
                const paragraph = $createParagraphNode();
                const text = listItem.getTextContent();
                if (text) {
                  paragraph.append($createTextNode(text));
                }
                listItem.replace(paragraph);
                paragraph.selectEnd();
              }
              this.editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
            } else {
              this.editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
            }

            return true;
          }

          // Not in list, just add 4 spaces
          if (!event.shiftKey) {
            const text = $createTextNode('    ');
            selection.insertNodes([text]);
          }

          return true; // Prevent default tab behavior
        },
        COMMAND_PRIORITY_LOW
      ),
    );

    // Listen for changes in the editor, and save the changes to the store
    this.editor.registerUpdateListener(() => {
      this.saveCurrentTemplate();
    });

    // Display the currently active templateid (if there is one)
    const id = this.templateId();
    if (id !== undefined) {
      this.loadTemplateFromId(id);
    }
  }

  /**
   * Load a template from the store (based on id), then update the Lexical
   * editor with the template's contents.
   * 
   * @param id ID of the template to load
   */
  loadTemplateFromId(id: number) {
    if (!this.editor) {
      console.warn('Skipping loadTemplate. this.editor undefined.')
      return;
    }

    const template = this.templateStore.templates().find((n) => n.id == id);
    if (!template) {
      return;
    }

    const content = template.content;

    // If the template had 'null' for content, create a root and a paragraph
    if (content == null) {
      this.editor.update(() => {
        const root = $getRoot();
        root.clear();

        const paragraph = $createParagraphNode();
        root.append(paragraph);
      });
      return;
    }

    // If template had content, parse and load it into the editor state
    try {
      const state = this.editor.parseEditorState(content);
      this.editor.setEditorState(state);
    } catch (e) {
      console.error("Error parsing / loading editor state", e)
    } finally {
    }
  }

  /**
   * Take the current editor contents, and save it to the store
   * using the current template id.
   *
   * @returns 
   */
  saveCurrentTemplate() {
    if (!this.editor) {
      console.warn('Skipping saveTemplate. Editor undefined.')
      return;
    }

    const id = this.templateId();
    if (id === undefined) {
      return;
    }

    const editorState = this.editor.getEditorState();
    const editorContent = editorState.toJSON();

    this.templateStore.updateTemplateContent(id, editorContent);
  }

  ngOnDestroy() {
    if (this.editor) {
      this.editor.setRootElement(null);
    }
  }
}
