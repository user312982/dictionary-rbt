interface TreeNodeKey {
  key: string;
  description: string;
}

interface TreeNodeValue {
  value: string;
  description: string;
}

export class Node {
  key: TreeNodeKey;
  value: TreeNodeValue;
  isRed: boolean;
  parent: Node | null;
  left: Node | null;
  right: Node | null;
  gimmick: (() => any) | null;

  constructor(
    key: TreeNodeKey,
    value: TreeNodeValue,
    gimmick: (() => any) | null = null,
    isRed: boolean = true
  ) {
    this.key = key;
    this.value = value;
    this.isRed = isRed;
    this.parent = null;
    this.left = null;
    this.right = null;
    this.gimmick = gimmick;
  }
}

export class RedBlackTree {
  private TNULL: Node;
  private root: Node;

  constructor() {
    this.TNULL = new Node(
      { key: "", description: "" },
      { value: "", description: "" },
      null,
      false
    );
    this.root = this.TNULL;
  }

  insert(key: TreeNodeKey, value: TreeNodeValue, gimmick: (() => any) | null = null): void {
    let y: Node | null = null;
    let x: Node = this.root;

    while (x !== this.TNULL) {
      y = x;
      if (key.key < x.key.key) {
        x = x.left!;
      } else if (key.key > x.key.key) {
        x = x.right!;
      } else {
        x.value = value;
        x.gimmick = gimmick;
        return;
      }
    }

    const newNode = new Node(key, value, gimmick);
    newNode.left = this.TNULL;
    newNode.right = this.TNULL;
    newNode.parent = y;
    if (!y) {
      this.root = newNode;
    } else if (key.key < y.key.key) {
      y.left = newNode;
    } else {
      y.right = newNode;
    }

    if (!newNode.parent) {
      newNode.isRed = false;
      return;
    }

    if (!newNode.parent.parent) {
      return;
    }

    this.fixInsert(newNode);
  }

  private fixInsert(node: Node): void {
    while (node.parent && node.parent.isRed) {
      if (node.parent === node.parent.parent?.right) {
        const uncle = node.parent.parent.left;
        if (uncle?.isRed) {
          uncle.isRed = false;
          node.parent.isRed = false;
          node.parent.parent.isRed = true;
          node = node.parent.parent;
        } else {
          if (node === node.parent.left) {
            node = node.parent;
            this.rightRotate(node);
          }
          node.parent!.isRed = false;
          node.parent!.parent!.isRed = true;
          this.leftRotate(node.parent!.parent!);
        }
      } else {
        const uncle = node.parent.parent?.right;
        if (uncle?.isRed) {
          uncle.isRed = false;
          node.parent.isRed = false;
          node.parent.parent.isRed = true;
          node = node.parent.parent;
        } else {
          if (node === node.parent.right) {
            node = node.parent;
            this.leftRotate(node);
          }
          node.parent!.isRed = false;
          node.parent!.parent!.isRed = true;
          this.rightRotate(node.parent!.parent!);
        }
      }
      if (node === this.root) {
        break;
      }
    }
    this.root.isRed = false;
  }

  private leftRotate(node: Node): void {
    const temp = node.right!;
    node.right = temp.left!;
    if (temp.left !== this.TNULL) {
      temp.left!.parent = node;
    }
    temp.parent = node.parent;
    if (!node.parent) {
      this.root = temp;
    } else if (node === node.parent.left) {
      node.parent.left = temp;
    } else {
      node.parent.right = temp;
    }
    temp.left = node;
    node.parent = temp;
  }

  private rightRotate(node: Node): void {
    const temp = node.left!;
    node.left = temp.right!;
    if (temp.right !== this.TNULL) {
      temp.right!.parent = node;
    }
    temp.parent = node.parent;
    if (!node.parent) {
      this.root = temp;
    } else if (node === node.parent.right) {
      node.parent.right = temp;
    } else {
      node.parent.left = temp;
    }
    temp.right = node;
    node.parent = temp;
  }

  inOrderTraversal(callback: (node: Node) => void, node: Node | null = this.root): void {
    if (!node || node === this.TNULL) return;
    this.inOrderTraversal(callback, node.left);
    callback(node);
    this.inOrderTraversal(callback, node.right);
  }

  searchSequentialKey(query: string): Array<{ key: string; value: string; description: string; gimmick?: (() => any) | null }> {
    const results: Array<{ key: string; value: string; description: string; gimmick?: (() => any) | null }> = [];
    const lowerQuery = query.toLowerCase();
  
    this.inOrderTraversal((node) => {
      if (node.key.key.toLowerCase().startsWith(lowerQuery)) {
        results.push({
          key: node.key.key,
          value: node.value.value,
          description: node.key.description,
          gimmick: node.gimmick, // Include gimmick if present
        });
      }
    });
  
    return results;
  }

  searchSequentialValue(query: string): Array<{ key: string; value: string; description: string; gimmick?: (() => any) | null }> {
    const results: Array<{ key: string; value: string; description: string; gimmick?: (() => any) | null }> = [];
    const lowerQuery = query.toLowerCase();
  
    this.inOrderTraversal((node) => {
      if (node.value.value.toLowerCase().startsWith(lowerQuery)) {
        results.push({
          key: node.key.key,
          value: node.value.value,
          description: node.value.description,
          gimmick: node.gimmick, // Include gimmick if present
        });
      }
    });
  
    return results;
  }

  importData(data: { key: string; keyDescription: string; value: string; valueDescription: string; gimmick?: (() => any) | null }[]): void {
    data.forEach((entry) =>
      this.insert(
        { key: entry.key, description: entry.keyDescription },
        { value: entry.value, description: entry.valueDescription },
        entry.gimmick || null
      )
    );
  }
}
