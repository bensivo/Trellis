import { TextMatchTransformer } from '@lexical/markdown';
import { $applyNodeReplacement, EditorConfig, ElementNode, LexicalNode } from "lexical";
import { NotePanel } from "../note-panel/note-panel";

export class AppLinkNode extends ElementNode {

  noteId: number | null = null;
  noteName: string | null = null;

  setNoteId(noteId: number): void {
    this.noteId = noteId;
  }

  setNoteName(noteName: string): void {
    this.noteName = noteName;
  }

  static override getType(): string {
    return 'app-link';
  }

  static override clone(node: AppLinkNode): AppLinkNode {
    return new AppLinkNode(node.__key);
  }

  override createDOM(): HTMLElement {
    // Define the DOM element here
    const element = document.createElement('button');
    element.className = 'editor-link-node';
    element.textContent = this.noteName;

    element.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const id = this.noteId;
      const name = this.noteName;
      const tabService = (window as any).tabService;

      if (id === null || name === null || tabService === undefined) {
        console.error('AppLinkNode: noteId or noteName is null');
        return;
      }

      // Use the globally-injected tabService to open the note in a new tab
      tabService.addTab('note' + id, name, NotePanel, {
        id,
      });
    };

    return element;
  }

  override updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
    // Returning false tells Lexical that this node does not need its
    // DOM element replacing with a new copy from createDOM.
    return false;
  }

  // Override the `exportJSON` method to include noteId and noteName
  override exportJSON(): any {
    return {
      ...super.exportJSON(),
      noteId: this.noteId,
      noteName: this.noteName,
      type: 'app-link',
      version: 1,
    };
  }

  // Override the `importJSON` method to properly set the noteId and noteName 
  // when loading via `editor.parseEditorState()`
  static override importJSON(serializedNode: any): AppLinkNode {
    const node = $applyNodeReplacement(new AppLinkNode());
    node.setNoteId(serializedNode.noteId);
    node.setNoteName(serializedNode.noteName);
    return node;
  }


  /**
   * Override some property getters to get proper
   * inline behavior
   */
  override isInline(): boolean {
    return true;
  }

  override canInsertTextBefore(): boolean {
    return true;
  }

  override canInsertTextAfter(): boolean {
    return true;
  }

  override canBeEmpty(): boolean {
    return false;
  }
}

export function $createAppLinkNode(noteId: number, noteName: string): AppLinkNode {
  const node = $applyNodeReplacement(new AppLinkNode());
  node.setNoteId(noteId);
  node.setNoteName(noteName);
  return node;
}

export function $isAppLinkNode(
  node: LexicalNode | null | undefined
): node is AppLinkNode {
  return node instanceof AppLinkNode;
}


export const APP_LINK_TRANSFORMER: TextMatchTransformer = {
  dependencies: [AppLinkNode],
  export: (node: LexicalNode) => {
    if ($isAppLinkNode(node)) {
      return node.noteName || '';
    }
    return null;
  },
  regExp: /.*/, // Normally used for improts, to find the text that turns into an app link. We're not using it here.
  replace: () => {
    // Implement this if we ever want to create app-links from MD strings
  },
  type: 'text-match',
};