import { $applyNodeReplacement, EditorConfig, ElementNode, LexicalNode, NodeKey, RangeSelection } from "lexical";

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

    return element;
  }

  override updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
    // Returning false tells Lexical that this node does not need its
    // DOM element replacing with a new copy from createDOM.
    return false;
  }

    // Handle backspace to delete the entire node
  // handleBackspace(selection: RangeSelection): boolean {
  //   this.remove();
  //   return true; // Prevent default backspace behavior
  // }

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