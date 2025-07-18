import { $applyNodeReplacement, EditorConfig, ElementNode, LexicalNode, NodeKey } from "lexical";

export class AppLinkNode extends ElementNode {
  static override getType(): string {
    return 'app-link';
  }

  static override clone(node: AppLinkNode): AppLinkNode {
    return new AppLinkNode(node.__key);
  }

  override createDOM(): HTMLElement {
    // Define the DOM element here
    const element = document.createElement('a');
    element.className = 'editor-link-node';
    element.textContent = 'Click Me!';
    element.href = '#'; // Set the link's href attribute

    return element;
  }

  override updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
    // Returning false tells Lexical that this node does not need its
    // DOM element replacing with a new copy from createDOM.
    return false;
  }
}

export function $createAppLinkNode(): AppLinkNode {
  return $applyNodeReplacement(new AppLinkNode());
}

export function $isAppLinkNode(
  node: LexicalNode | null | undefined
): node is AppLinkNode {
  return node instanceof AppLinkNode;
}