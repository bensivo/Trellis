import { $generateHtmlFromNodes } from '@lexical/html';
import { AfterViewInit, Component, computed, HostListener, inject, input } from '@angular/core';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { createEmptyHistoryState, registerHistory } from '@lexical/history';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { $isListItemNode, ListItemNode, ListNode } from '@lexical/list';
import { $convertToMarkdownString, registerMarkdownShortcuts, TRANSFORMERS } from '@lexical/markdown';
import { HeadingNode, QuoteNode, registerRichText } from '@lexical/rich-text';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import { $createParagraphNode, $createTextNode, $getRoot, $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW, createEditor, INDENT_CONTENT_COMMAND, KEY_BACKSPACE_COMMAND, KEY_TAB_COMMAND, OUTDENT_CONTENT_COMMAND, PASTE_COMMAND } from 'lexical';
import { AddLinkModalService } from '../../services/add-link-modal-service';
import { NotesService } from '../../services/notes-service';
import { NotesStore } from '../../store/notes-store';
import { $createImageNode, $isImageNode, ImageNode } from './app-image-node';
import { $createAppLinkNode, $isAppLinkNode, AppLinkNode } from './app-link-node';

import jsPDF from 'jspdf';


@Component({
  selector: 'app-note-text-editor',
  imports: [],
  templateUrl: './note-text-editor.html',
  styleUrl: './note-text-editor.less'
})
export class NoteTextEditor implements AfterViewInit {
  readonly noteId = input<number>();
  readonly noteStore = inject(NotesStore);
  readonly notesService = inject(NotesService);
  readonly addLinkModalService = inject(AddLinkModalService);

  readonly currentNote = computed(() => {
    const notes = this.noteStore.notes();
    const note = notes.find(n => n.id === this.noteId());
    if (!note) {
      return null;
    }

    return note;
  })

  private editor: any;

  ngAfterViewInit() {
    const editorDiv = document.getElementById('note-text-editor');
    if (!editorDiv) {
      console.error("CAn't initialize lexical, div#note-text-editor not found");
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
        AppLinkNode, // Custom AppLinkNode
        ImageNode, // Custom ImageNode
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

      // Custom backspace logic, to handle deleting custom nodes
      this.editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        (event: any) => {
          event.preventDefault();
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            return true;
          }

          const appLink = selection.getNodes().find($isAppLinkNode);
          if (appLink) {
            appLink.remove();
            return true; // Prevent default backspace behavior
          }

          const image = selection.getNodes().find($isImageNode);
          if (image) {
            image.remove();
            return true; // Prevent default backspace behavior
          }

          // If not, just let the default backspace behavior happen
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),

      // Custom paste logic, to handle pasting images
      this.editor.registerCommand(
        PASTE_COMMAND,
        (event: ClipboardEvent) => {
          const clipboardData = event.clipboardData;
          if (!clipboardData) return false;

          // Check for images
          const items = Array.from(clipboardData.items);
          const imageItem = items.find(item => item.type.startsWith('image/'));

          if (imageItem) {
            event.preventDefault();
            const file = imageItem.getAsFile();
            if (file) {
              this.handleImagePaste(file);
            }
            return true;
          }

          return false; // Let default paste handle text
        },
        COMMAND_PRIORITY_LOW
      ),
    );

    // Listen for changes in the editor, and save the changes to the store
    this.editor.registerUpdateListener(() => {
      this.saveCurrentNote();
    });

    // Display the currently active noteid (if there is one)
    const id = this.noteId();
    if (id !== undefined) {
      this.loadNoteFromId(id);
    }
  }

  async exportToPDF() {
    if (!this.editor) {
      console.warn('Skipping exportToPDF. Editor undefined.');
      return;
    }
    const editorElement = document.getElementById('note-text-editor');
    if (!editorElement) return;

    const note = this.currentNote();
    if (!note) {
      console.warn('No current note to export.');
      return;
    }

    this.editor.update(() => {
      const htmlString = $generateHtmlFromNodes(this.editor, null);
      const pdf = new jsPDF();
      pdf.html(htmlString, {
        callback: (doc) => {
          doc.save(`${note.name}.pdf`);
        },
        x: 10,
        y: 10,
        width: 180, // A4 width minus margins
        windowWidth: 800,
        html2canvas: {
          scale: 0.25,
        }
      });
    });
  }

  /**
   * Load a note from the store (based on id), then update the Lexical
   * editor with the note's contents.
   * 
   * @param id ID of the note to load
   */
  loadNoteFromId(id: number) {
    if (!this.editor) {
      console.warn('Skipping loadNote. this.editor undefined.')
      return;
    }

    const note = this.noteStore.notes().find((n) => n.id == id);
    if (!note) {
      return;
    }

    const content = note.content;

    // If the note had 'null' for content, create a root and a paragraph
    if (content == null) {
      this.editor.update(() => {
        const root = $getRoot();
        root.clear();

        const paragraph = $createParagraphNode();
        root.append(paragraph);
      });
      return;
    }

    // If note had content, parse and load it into the editor state
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
   * using the current note id.
   *
   * @returns 
   */
  saveCurrentNote() {
    if (!this.editor) {
      console.warn('Skipping saveNote. Editor undefined.')
      return;
    }

    const id = this.noteId();
    if (id === undefined) {
      return;
    }

    const editorState = this.editor.getEditorState();
    const editorContent = editorState.toJSON();

    this.noteStore.updateNoteContent(id, editorContent);
  }

  ngOnDestroy() {
    if (this.editor) {
      this.editor.setRootElement(null);
    }
  }

  addCustomLink() {
    if (!this.editor) {
      console.warn('Skipping addCustomLink. Editor undefined.')
      return;
    }

    const noteId = this.noteId();
    if (noteId === undefined) {
      console.warn('Skipping addCustomLink. Note ID undefined.');
      return;
    }

    // TODO: pass note-id, and position in note, so that we can come back to the same location
    this.addLinkModalService.openAddLinkModal((noteId: number, noteName: string) => {
      this.editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return;
        }

        // Create a new AppLinkNode with the noteId
        const linkNode = $createAppLinkNode(noteId, noteName);
        selection.insertNodes([linkNode, $createTextNode(' ')]);
        linkNode.selectNext();
      });
    });
  }

  handleImagePaste(file: File) {
    // Convert to data URL or upload to server
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if ((window as any).electron) {

        const mimeToExt: Record<string, string> = {
          'image/png': 'png',
          'image/jpeg': 'jpg',
          'image/jpg': 'jpg',
          'image/gif': 'gif',
          'image/webp': 'webp',
          'image/svg+xml': 'svg'
        };
        const extension = mimeToExt[file.type] || 'png';
        const filepath = `image-${Date.now()}.${extension}`;
        const data = dataUrl.split(',')[1]; // Remove "data:image/png;base64,"

        (window as any).electron.putObject(filepath, data)
          .then(() => {

            // NOTE: this works because of our custom 'trellis' protocol handler in electron's main.js,
            // which translates the given relative filepath into the appropriate absolute filepath on 
            // the base OS in the application directory
            const src = 'trellis://' + filepath 

            this.editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                const imageNode = $createImageNode(src);
                selection.insertNodes([imageNode, $createParagraphNode()]);
              }
            });
          });
      } else {
        this.editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const imageNode = $createImageNode(dataUrl);
            selection.insertNodes([imageNode, $createParagraphNode()]);
          }
        });
      }

    };
    reader.readAsDataURL(file);
  }


  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Cmd+L on Mac or Ctrl+L on Windows/Linux
    if ((event.metaKey || event.ctrlKey) && event.key === 'l') {
      event.preventDefault(); // Prevent browser's "New Window"
      this.addCustomLink();
    }
  }
}
