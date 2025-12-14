import type {
  NodeBase,
  EdgeBase,
  Viewport,
  XYPosition,
  Connection,
  Rect,
  FitBoundsOptions,
  SetCenterOptions,
  ViewportHelperFunctionOptions,
} from '@xyflow/system';

/**
 * 节点类型
 */
export type Node<NodeData extends Record<string, unknown> = Record<string, unknown>> = NodeBase<NodeData>;

/**
 * 边类型
 */
export type Edge<EdgeData extends Record<string, unknown> = Record<string, unknown>> = EdgeBase<EdgeData>;

/**
 * XYFlow 初始化选项
 */
export interface XYFlowOptions {
  /** 容器元素 */
  container: HTMLElement;
  /** 初始节点 */
  nodes?: Node[];
  /** 初始边 */
  edges?: Edge[];
  /** 初始视口 */
  viewport?: Viewport;
  /** 最小缩放级别 */
  minZoom?: number;
  /** 最大缩放级别 */
  maxZoom?: number;
  /** 是否启用平移 */
  panOnDrag?: boolean;
  /** 是否启用滚轮缩放 */
  zoomOnScroll?: boolean;
  /** 是否启用双击缩放 */
  zoomOnDoubleClick?: boolean;
  /** 节点是否可拖拽 */
  nodesDraggable?: boolean;
  /** 节点是否可连接 */
  nodesConnectable?: boolean;
  /** 元素是否可选择 */
  elementsSelectable?: boolean;
}

/**
 * XYFlow 实例方法
 */
export interface XYFlowInstance {
  /** 设置节点 */
  setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;
  /** 获取节点 */
  getNodes: () => Node[];
  /** 设置边 */
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;
  /** 获取边 */
  getEdges: () => Edge[];
  /** 添加节点 */
  addNodes: (nodes: Node[]) => void;
  /** 添加边 */
  addEdges: (edges: Edge[]) => void;
  /** 删除元素 */
  deleteElements: (params: { nodes?: Node[]; edges?: Edge[] }) => void;
  /** 更新节点数据 */
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
  /** 获取视口 */
  getViewport: () => Viewport;
  /** 设置视口 */
  setViewport: (viewport: Viewport, options?: ViewportHelperFunctionOptions) => Promise<boolean>;
  /** 适应视图 */
  fitView: (options?: FitBoundsOptions) => Promise<boolean>;
  /** 设置中心点 */
  setCenter: (x: number, y: number, options?: SetCenterOptions) => Promise<boolean>;
  /** 获取缩放级别 */
  getZoom: () => number;
  /** 缩放 */
  zoomIn: (options?: ViewportHelperFunctionOptions) => Promise<boolean>;
  /** 缩小 */
  zoomOut: (options?: ViewportHelperFunctionOptions) => Promise<boolean>;
  /** 缩放到指定级别 */
  zoomTo: (zoomLevel: number, options?: ViewportHelperFunctionOptions) => Promise<boolean>;
  /** 转换为对象 */
  toObject: () => { nodes: Node[]; edges: Edge[]; viewport: Viewport };
  /** 销毁实例 */
  destroy: () => void;
}
