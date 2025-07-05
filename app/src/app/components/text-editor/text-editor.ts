import { KEY_TAB_COMMAND, COMMAND_PRIORITY_LOW, $isRangeSelection, OUTDENT_CONTENT_COMMAND, INDENT_CONTENT_COMMAND} from 'lexical';
import { Component, AfterViewInit } from '@angular/core';
import { createEditor, $getRoot, $getSelection, $createParagraphNode, $createTextNode } from 'lexical';
import {createEmptyHistoryState, registerHistory} from '@lexical/history';
import {HeadingNode, QuoteNode, registerRichText} from '@lexical/rich-text';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode, $isListItemNode, $isListNode } from '@lexical/list';
import {$findMatchingParent, mergeRegister} from '@lexical/utils';
import { registerMarkdownShortcuts } from '@lexical/markdown';



@Component({
  selector: 'app-text-editor',
  imports: [],
  templateUrl: './text-editor.html',
  styleUrl: './text-editor.less'
})
export class TextEditorComponent implements AfterViewInit {
  private editor: any;

  ngAfterViewInit() {
    const editorDiv = document.getElementById('text-editor');
    if (!editorDiv) {
      console.error("CAn't initialize lexical, div#text-editor not found");
      return;
    }

    const editor = createEditor({
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

    // Mount the editor
    editor.setRootElement(editorDiv);

    // Registering Plugins
    mergeRegister(
      registerRichText(editor),
      registerHistory(editor, createEmptyHistoryState(), 300),
      registerMarkdownShortcuts(editor),

          // Handle Tab key
      editor.registerCommand(
        KEY_TAB_COMMAND,
        (event) => {
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
              editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
            } else {
              editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
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

    // // Example of programmatic updates
    // editor.update(() => {
    //   // Get the RootNode from the EditorState
    //   const root = $getRoot();

    //   // Get the selection from the EditorState
    //   const selection = $getSelection();

    //   // Create a new ParagraphNode
    //   const paragraphNode = $createParagraphNode();

    //   // Create a new TextNode
    //   const textNode = $createTextNode('Hello world');

    //   // Append the text node to the paragraph
    //   paragraphNode.append(textNode);

    //   // Finally, append the paragraph to the root
    //   root.append(paragraphNode);
    // });
  }

  ngOnDestroy() {
    if (this.editor) {
      this.editor.setRootElement(null);
    }
  }
}
