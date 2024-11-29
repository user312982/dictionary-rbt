type Color = "red" | "black";

interface TreeNodeKey {
  key: string;
  description: string;
}

interface TreeNodeValue {
  value: string;
  description: string;
}

class Node {
  key: TreeNodeKey;
  value: TreeNodeValue;
  color: Color;
  parent: Node | null;
  left: Node | null;
  right: Node | null;

  constructor(
    key: TreeNodeKey,
    value: TreeNodeValue,
    color: Color = "red"
  ) {
    this.key = key;
    this.value = value;
    this.color = color;
    this.parent = null;
    this.left = null;
    this.right = null;
  }
}

export class RedBlackTree {
  private TNULL: Node;
  private root: Node;

  constructor() {
    this.TNULL = new Node(
      { key: "", description: "" },
      { value: "", description: "" },
      "black"
    );
    this.root = this.TNULL;
  }

  insert(key: TreeNodeKey, value: TreeNodeValue): void {
    const newNode = new Node(key, value);
    newNode.left = this.TNULL;
    newNode.right = this.TNULL;

    let y: Node | null = null;
    let x: Node = this.root;

    while (x !== this.TNULL) {
      y = x;
      if (key.key < x.key.key) {
        x = x.left!;
      } else {
        x = x.right!;
      }
    }

    newNode.parent = y;
    if (!y) {
      this.root = newNode;
    } else if (key.key < y.key.key) {
      y.left = newNode;
    } else {
      y.right = newNode;
    }

    if (!newNode.parent) {
      newNode.color = "black";
      return;
    }

    if (!newNode.parent.parent) {
      return;
    }

    this.fixInsert(newNode);
  }

  private fixInsert(node: Node): void {
    while (node.parent && node.parent.color === "red") {
      if (node.parent === node.parent.parent?.right) {
        const uncle = node.parent.parent.left;
        if (uncle?.color === "red") {
          uncle.color = "black";
          node.parent.color = "black";
          node.parent.parent.color = "red";
          node = node.parent.parent;
        } else {
          if (node === node.parent.left) {
            node = node.parent;
            this.rightRotate(node);
          }
          node.parent!.color = "black";
          node.parent!.parent!.color = "red";
          this.leftRotate(node.parent!.parent!);
        }
      } else {
        const uncle = node.parent.parent?.right;
        if (uncle?.color === "red") {
          uncle.color = "black";
          node.parent.color = "black";
          node.parent.parent.color = "red";
          node = node.parent.parent;
        } else {
          if (node === node.parent.right) {
            node = node.parent;
            this.leftRotate(node);
          }
          node.parent!.color = "black";
          node.parent!.parent!.color = "red";
          this.rightRotate(node.parent!.parent!);
        }
      }
      if (node === this.root) {
        break;
      }
    }
    this.root.color = "black";
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

  searchByKey(key: string): TreeNodeValue | null {
    let current = this.root;
    while (current !== this.TNULL) {
      if (key === current.key.key) {
        return current.value;
      }
      current = key < current.key.key ? current.left! : current.right!;
    }
    return null;
  }

  searchByValue(value: string): TreeNodeKey | null {
    const traverse = (node: Node): TreeNodeKey | null => {
      if (node === this.TNULL) return null;
      if (node.value.value === value) return node.key;
      return traverse(node.left!) || traverse(node.right!);
    };
    return traverse(this.root);
  }

  importData(data: { key: string; keyDescription: string; value: string; valueDescription: string }[]): void {
    data.forEach((entry) =>
      this.insert(
        { key: entry.key, description: entry.keyDescription },
        { value: entry.value, description: entry.valueDescription }
      )
    );
  }
}
