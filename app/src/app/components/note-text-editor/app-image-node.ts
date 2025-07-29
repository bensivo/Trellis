import { $applyNodeReplacement, ElementNode } from "lexical";

export class ImageNode extends ElementNode {
  __src: string;
  __alt: string;

  constructor(src: string, alt: string = '', key?: string) {
    super(key);
    this.__src = src;
    this.__alt = alt;
  }

  static override getType(): string {
    return 'image';
  }

  static override clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__alt, node.__key);
  }

  override createDOM(): HTMLElement {
    const img = document.createElement('img');
    img.src = this.__src;
    img.alt = this.__alt;
    img.className = 'editor-image';
    return img;
  }

  override updateDOM(): boolean {
    return false;
  }

  override exportJSON(): any {
    return {
      ...super.exportJSON(),
      src: this.__src,
      alt: this.__alt,
      type: 'image',
      version: 1,
    };
  }

  static override importJSON(serializedNode: any): ImageNode {
    return $applyNodeReplacement(new ImageNode(serializedNode.src, serializedNode.alt));
  }

  /**
   * Override some property getters to get proper
   * inline behavior
   */
  override isInline(): boolean {
    return true;
  }
  
  override canInsertTextBefore(): boolean {
    return false;
  }
  
  override canInsertTextAfter(): boolean {
    return false;
  }
  
  override canBeEmpty(): boolean {
    return false;
  }
  override isShadowRoot(): boolean {
    return false;
  }
}

export function $createImageNode(src: string, alt: string = ''): ImageNode {
  return $applyNodeReplacement(new ImageNode(src, alt));
}

export function $isImageNode(node: any): node is ImageNode {
  return node instanceof ImageNode;
}