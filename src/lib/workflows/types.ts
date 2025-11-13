export type UUID = string;

export interface Workflow {
  id: UUID;
  name: string;
  slug: string;
  description?: string;
  createdBy?: UUID;
  orgId?: UUID;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowVersion {
  id: UUID;
  workflowId: UUID;
  version: number;
  graph: Graph;
  createdAt: string;
  note?: string;
}

export interface Graph {
  nodes: NodeInstance[];
  edges: EdgeInstance[];
}

export interface NodeInstance {
  id: UUID;
  type: string;
  label: string;
  position: { x: number; y: number };
  disabled?: boolean;
  config: unknown;
}

export interface EdgeInstance {
  id: UUID;
  source: UUID;
  sourceHandle?: string;
  target: UUID;
  targetHandle?: string;
  condition?: string;
}

export interface WorkflowTemplate {
  id: UUID;
  name: string;
  description: string;
  thumbnail?: string;
  graph: Graph;
}


