export interface TreeNode {
  /** Folder or file name segment */
  segment: string;
  /** Full path from root, e.g. "java/hashmap" */
  path: string;
  /** Display label */
  label: string;
  /** true = content page, false = folder */
  isLeaf: boolean;
  /** Child nodes */
  children: TreeNode[];
  /** Sort order among siblings */
  order: number;
}

interface EntryLike {
  id: string;
  data: {
    title: string;
    order?: number;
    draft?: boolean;
  };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Build a nested tree from a flat list of content entries.
 * Each entry.id is a slash-separated path like "java/hashmap/deep-dive".
 */
export function buildTree(entries: EntryLike[]): TreeNode[] {
  const root: TreeNode[] = [];

  // Map of path → node for quick lookup
  const nodeMap = new Map<string, TreeNode>();

  function getOrCreateNode(segments: string[], depth: number): TreeNode {
    const path = segments.slice(0, depth + 1).join('/');
    let node = nodeMap.get(path);
    if (!node) {
      node = {
        segment: segments[depth],
        path,
        label: capitalize(segments[depth]),
        isLeaf: false,
        children: [],
        order: 0,
      };
      nodeMap.set(path, node);

      // Attach to parent or root
      if (depth === 0) {
        root.push(node);
      } else {
        const parentPath = segments.slice(0, depth).join('/');
        const parent = nodeMap.get(parentPath);
        if (parent && !parent.children.includes(node)) {
          parent.children.push(node);
        }
      }
    }
    return node;
  }

  for (const entry of entries) {
    const segments = entry.id.split('/');

    // Create intermediate folder nodes
    for (let i = 0; i < segments.length - 1; i++) {
      getOrCreateNode(segments, i);
    }

    // Create the leaf node
    const leafPath = entry.id;
    const leaf: TreeNode = {
      segment: segments[segments.length - 1],
      path: leafPath,
      label: entry.data.title,
      isLeaf: true,
      children: [],
      order: entry.data.order ?? 999,
    };
    nodeMap.set(leafPath, leaf);

    // Attach to parent
    if (segments.length === 1) {
      root.push(leaf);
    } else {
      const parentPath = segments.slice(0, -1).join('/');
      const parent = nodeMap.get(parentPath);
      if (parent) {
        parent.children.push(leaf);
      }
    }
  }

  // Sort children recursively
  function sortChildren(nodes: TreeNode[]) {
    nodes.sort((a, b) => {
      // Folders before leaves
      if (a.isLeaf !== b.isLeaf) return a.isLeaf ? 1 : -1;
      // Then by order
      if (a.order !== b.order) return a.order - b.order;
      // Then alphabetically
      return a.label.localeCompare(b.label);
    });
    for (const node of nodes) {
      if (node.children.length > 0) {
        sortChildren(node.children);
      }
    }
  }

  sortChildren(root);
  return root;
}
