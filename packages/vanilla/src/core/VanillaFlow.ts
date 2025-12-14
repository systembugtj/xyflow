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
  PanZoomInstance,
  Transform,
  ConnectionState,
  Handle,
  ConnectionMode,
  OnConnect,
  OnConnectStart,
  OnConnectEnd,
  UpdateConnection,
  IsValidConnection,
  NodeLookup,
  PanBy,
} from '@xyflow/system';
import {
  XYPanZoom,
  getNodesBounds,
  getViewportForBounds,
  addEdge as addEdgeUtil,
  infiniteExtent,
  ConnectionMode as CM,
} from '@xyflow/system';
import type { Node, Edge, XYFlowOptions, XYFlowInstance } from '../types';

/**
 * XYFlow 核心类
 * 提供框架无关的节点编辑器功能
 */
// Flow 状态接口
interface FlowState {
  connectOnClick: boolean;
  noPanClassName: string;
  rfId: string | null;
  autoPanOnConnect: boolean;
  connectionMode: ConnectionMode;
  connectionRadius: number;
  domNode: HTMLDivElement | null;
  nodeLookup: NodeLookup;
  lib: string;
  panBy: PanBy;
  cancelConnection: () => void;
  onConnectStart?: OnConnectStart;
  onConnect?: OnConnect;
  onConnectEnd?: OnConnectEnd;
  isValidConnection?: IsValidConnection;
  updateConnection?: UpdateConnection;
  autoPanSpeed: number;
  connectionDragThreshold: number;
  onClickConnectStart?: (
    event: MouseEvent | TouchEvent,
    params: { nodeId: string; handleId: string | null; handleType: string }
  ) => void;
  onClickConnectEnd?: (event: MouseEvent | TouchEvent, connectionState: any) => void;
  defaultEdgeOptions?: Partial<Connection>;
  hasDefaultEdges: boolean;
  setEdges?: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;
}

interface ConnectionStateInternal {
  connectionClickStartHandle: { nodeId: string; type: string; id: string | null } | null;
  connection: {
    inProgress: boolean;
    fromHandle: Handle | null;
    toHandle: Handle | null;
    isValid: boolean;
  };
}

export class VanillaFlow implements XYFlowInstance {
  private container: HTMLElement;
  private viewportElement: HTMLElement | null = null;
  private panZoom: PanZoomInstance | null = null;
  private nodes: Node[] = [];
  private edges: Edge[] = [];
  private viewport: Viewport = { x: 0, y: 0, zoom: 1 };
  private options: Required<
    Pick<
      XYFlowOptions,
      | 'minZoom'
      | 'maxZoom'
      | 'panOnDrag'
      | 'zoomOnScroll'
      | 'zoomOnDoubleClick'
      | 'nodesDraggable'
      | 'nodesConnectable'
      | 'elementsSelectable'
    >
  >;

  // 连接状态管理
  private state: FlowState;
  private connectionState: ConnectionStateInternal = {
    connectionClickStartHandle: null,
    connection: {
      inProgress: false,
      fromHandle: null,
      toHandle: null,
      isValid: false,
    },
  };

  // 节点查找表（用于连接）
  private nodeLookup: NodeLookup = new Map();

  constructor(options: XYFlowOptions) {
    this.container = options.container;
    this.nodes = options.nodes || [];
    this.edges = options.edges || [];
    this.viewport = options.viewport || { x: 0, y: 0, zoom: 1 };

    this.options = {
      minZoom: options.minZoom ?? 0.5,
      maxZoom: options.maxZoom ?? 2,
      panOnDrag: options.panOnDrag ?? true,
      zoomOnScroll: options.zoomOnScroll ?? true,
      zoomOnDoubleClick: options.zoomOnDoubleClick ?? true,
      nodesDraggable: options.nodesDraggable ?? true,
      nodesConnectable: options.nodesConnectable ?? true,
      elementsSelectable: options.elementsSelectable ?? true,
    };

    // 初始化状态
    this.state = {
      connectOnClick: false,
      noPanClassName: 'nodrag',
      rfId: `xyflow-${Math.random().toString(36).substr(2, 9)}`,
      autoPanOnConnect: true,
      connectionMode: CM.Loose,
      connectionRadius: 0,
      domNode: null,
      nodeLookup: new Map(),
      lib: 'vanilla',
      panBy: () => Promise.resolve(true),
      cancelConnection: () => {},
      autoPanSpeed: 0.5,
      connectionDragThreshold: 1,
      hasDefaultEdges: true,
      setEdges: (edges) => this.setEdges(edges),
    };

    this.init();
  }

  /**
   * 初始化 XYFlow
   */
  private init(): void {
    // 创建视口容器
    this.viewportElement = document.createElement('div');
    this.viewportElement.className = 'vanilla-flow__viewport';
    this.viewportElement.style.width = '100%';
    this.viewportElement.style.height = '100%';
    this.viewportElement.style.position = 'relative';
    this.viewportElement.style.transformOrigin = '0 0';

    // 应用初始视口变换
    this.updateViewportTransform();

    this.container.appendChild(this.viewportElement);
    this.container.style.position = 'relative';
    this.container.style.width = '100%';
    this.container.style.height = '100%';
    this.container.style.overflow = 'hidden';

    // 更新状态中的 domNode 和 nodeLookup
    this.state.domNode = this.container as HTMLDivElement;
    this.state.nodeLookup = this.nodeLookup;

    // 初始化平移缩放
    this.initPanZoom();

    // 渲染初始节点和边
    this.render();
  }

  /**
   * 初始化平移缩放功能
   */
  private initPanZoom(): void {
    if (!this.viewportElement) return;

    this.panZoom = XYPanZoom({
      domNode: this.viewportElement,
      minZoom: this.options.minZoom,
      maxZoom: this.options.maxZoom,
      translateExtent: infiniteExtent,
      viewport: this.viewport,
      onPanZoom: (_, viewport) => {
        this.viewport = viewport;
        this.updateViewportTransform();
      },
      onPanZoomStart: () => {
        // 平移开始
      },
      onPanZoomEnd: () => {
        // 平移结束
      },
      onDraggingChange: () => {
        // 拖拽状态变化
      },
    });

    // 更新配置以启用滚轮缩放和双击缩放
    this.panZoom.update({
      zoomOnScroll: this.options.zoomOnScroll,
      zoomOnDoubleClick: this.options.zoomOnDoubleClick,
      panOnDrag: this.options.panOnDrag,
      preventScrolling: true,
      zoomOnPinch: true,
      panOnScroll: false,
      panOnScrollMode: 'free' as const,
      panOnScrollSpeed: 0.5,
      userSelectionActive: false,
      noWheelClassName: '',
      noPanClassName: '',
      onPaneContextMenu: undefined,
      zoomActivationKeyPressed: false,
      lib: 'vanilla',
      onTransformChange: (transform) => {
        this.viewport = {
          x: transform[0],
          y: transform[1],
          zoom: transform[2],
        };
        this.updateViewportTransform();
      },
      connectionInProgress: false,
      paneClickDistance: 0,
      selectionOnDrag: false,
    });
  }

  /**
   * 更新视口变换
   */
  private updateViewportTransform(): void {
    if (!this.viewportElement) return;
    this.viewportElement.style.transform = `translate(${this.viewport.x}px, ${this.viewport.y}px) scale(${this.viewport.zoom})`;

    // 触发视口变化事件，通知子组件（如 Background、Controls）
    if (this.container) {
      this.container.dispatchEvent(
        new CustomEvent('xyflow-viewport-change', {
          detail: { viewport: this.viewport },
          bubbles: true,
        })
      );
    }
  }

  /**
   * 渲染节点和边
   */
  private render(): void {
    if (!this.viewportElement) return;

    // 清空现有内容
    this.viewportElement.innerHTML = '';

    // 创建 SVG 容器用于边
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.className = 'vanilla-flow__edges';
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '1';

    // 渲染边
    this.edges.forEach((edge) => {
      const edgeElement = this.createEdgeElement(edge);
      svg.appendChild(edgeElement);
    });

    this.viewportElement.appendChild(svg);

    // 渲染节点
    this.nodes.forEach((node) => {
      const nodeElement = this.createNodeElement(node);
      this.viewportElement!.appendChild(nodeElement);
    });
  }

  /**
   * 创建节点元素
   */
  private createNodeElement(node: Node): HTMLElement {
    const nodeElement = document.createElement('div');
    nodeElement.className = `vanilla-flow__node ${node.className || ''}`;
    nodeElement.id = `xyflow-node-${node.id}`;
    nodeElement.style.position = 'absolute';
    nodeElement.style.left = `${node.position.x}px`;
    nodeElement.style.top = `${node.position.y}px`;
    nodeElement.style.zIndex = node.zIndex || '2';

    if (node.selected) {
      nodeElement.classList.add('selected');
    }

    // 创建节点内容
    const nodeContent = document.createElement('div');
    nodeContent.className = 'vanilla-flow__node-content';
    nodeContent.textContent = String(node.data?.label || node.id);
    nodeElement.appendChild(nodeContent);

    // 添加拖拽功能
    if (this.options.nodesDraggable && node.draggable !== false) {
      this.makeNodeDraggable(nodeElement, node);
    }

    return nodeElement;
  }

  /**
   * 使节点可拖拽
   */
  private makeNodeDraggable(element: HTMLElement, node: Node): void {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialX = node.position.x;
    let initialY = node.position.y;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialX = node.position.x;
      initialY = node.position.y;
      element.style.cursor = 'grabbing';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = (e.clientX - startX) / this.viewport.zoom;
      const deltaY = (e.clientY - startY) / this.viewport.zoom;

      const newX = initialX + deltaX;
      const newY = initialY + deltaY;

      node.position.x = newX;
      node.position.y = newY;
      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;
    };

    const handleMouseUp = () => {
      isDragging = false;
      element.style.cursor = 'grab';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    element.style.cursor = 'grab';
    element.addEventListener('mousedown', handleMouseDown);
  }

  /**
   * 创建边元素
   */
  private createEdgeElement(edge: Edge): SVGElement {
    const sourceNode = this.nodes.find((n) => n.id === edge.source);
    const targetNode = this.nodes.find((n) => n.id === edge.target);

    if (!sourceNode || !targetNode) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      return path;
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const sourceX = sourceNode.position.x + (sourceNode.width || 100) / 2;
    const sourceY = sourceNode.position.y + (sourceNode.height || 50) / 2;
    const targetX = targetNode.position.x + (targetNode.width || 100) / 2;
    const targetY = targetNode.position.y + (targetNode.height || 50) / 2;

    // 简单的直线边
    path.setAttribute('d', `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`);
    path.setAttribute('stroke', edge.selected ? '#ff0072' : '#b1b1b7');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('fill', 'none');
    path.setAttribute('class', `vanilla-flow__edge ${edge.selected ? 'selected' : ''}`);
    path.setAttribute('data-edge-id', edge.id);

    if (edge.animated) {
      path.setAttribute('stroke-dasharray', '5,5');
      const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
      animate.setAttribute('attributeName', 'stroke-dashoffset');
      animate.setAttribute('values', '0;10');
      animate.setAttribute('dur', '1s');
      animate.setAttribute('repeatCount', 'indefinite');
      path.appendChild(animate);
    }

    return path;
  }

  // 公共 API 方法

  setNodes(nodes: Node[] | ((nodes: Node[]) => Node[])): void {
    this.nodes = typeof nodes === 'function' ? nodes(this.nodes) : nodes;
    // 更新 nodeLookup
    this.updateNodeLookup();
    this.render();
  }

  getNodes(): Node[] {
    return [...this.nodes];
  }

  setEdges(edges: Edge[] | ((edges: Edge[]) => Edge[])): void {
    this.edges = typeof edges === 'function' ? edges(this.edges) : edges;
    this.render();
  }

  getEdges(): Edge[] {
    return [...this.edges];
  }

  addNodes(nodes: Node[]): void {
    this.nodes = [...this.nodes, ...nodes];
    this.updateNodeLookup();
    this.render();
  }

  addEdges(edges: Edge[]): void {
    this.edges = [...this.edges, ...edges];
    this.render();
  }

  deleteElements(params: { nodes?: Node[]; edges?: Edge[] }): void {
    if (params.nodes) {
      const nodeIds = new Set(params.nodes.map((n) => n.id));
      this.nodes = this.nodes.filter((n) => !nodeIds.has(n.id));
      this.updateNodeLookup();
    }
    if (params.edges) {
      const edgeIds = new Set(params.edges.map((e) => e.id));
      this.edges = this.edges.filter((e) => !edgeIds.has(e.id));
    }
    this.render();
  }

  updateNodeData(nodeId: string, data: Record<string, unknown>): void {
    const node = this.nodes.find((n) => n.id === nodeId);
    if (node) {
      node.data = { ...node.data, ...data };
      this.render();
    }
  }

  getViewport(): Viewport {
    return { ...this.viewport };
  }

  async setViewport(viewport: Viewport, options?: ViewportHelperFunctionOptions): Promise<boolean> {
    if (!this.panZoom) return false;
    this.viewport = { ...viewport };
    const result = await this.panZoom.setViewportConstrained(
      viewport,
      [
        [0, 0],
        [this.container.clientWidth, this.container.clientHeight],
      ],
      infiniteExtent
    );
    return !!result;
  }

  async fitView(options?: FitBoundsOptions): Promise<boolean> {
    if (this.nodes.length === 0) return false;

    const bounds = getNodesBounds(this.nodes);
    const viewport = getViewportForBounds(
      bounds,
      this.container.clientWidth,
      this.container.clientHeight,
      this.viewport.zoom,
      options?.padding || 0.1,
      options?.minZoom,
      options?.maxZoom
    );

    return this.setViewport(viewport, options);
  }

  async setCenter(x: number, y: number, options?: SetCenterOptions): Promise<boolean> {
    const centerX = this.container.clientWidth / 2;
    const centerY = this.container.clientHeight / 2;
    const viewport: Viewport = {
      x: centerX - x * this.viewport.zoom,
      y: centerY - y * this.viewport.zoom,
      zoom: this.viewport.zoom,
    };
    return this.setViewport(viewport, options);
  }

  getZoom(): number {
    return this.viewport.zoom;
  }

  getMinZoom(): number {
    return this.options.minZoom;
  }

  getMaxZoom(): number {
    return this.options.maxZoom;
  }

  async zoomIn(options?: ViewportHelperFunctionOptions): Promise<boolean> {
    if (!this.panZoom) return false;
    const newZoom = Math.min(this.options.maxZoom, this.viewport.zoom * 1.2);
    return this.panZoom.scaleTo(newZoom, options);
  }

  async zoomOut(options?: ViewportHelperFunctionOptions): Promise<boolean> {
    if (!this.panZoom) return false;
    const newZoom = Math.max(this.options.minZoom, this.viewport.zoom / 1.2);
    return this.panZoom.scaleTo(newZoom, options);
  }

  async zoomTo(zoomLevel: number, options?: ViewportHelperFunctionOptions): Promise<boolean> {
    if (!this.panZoom) return false;
    const clampedZoom = Math.max(this.options.minZoom, Math.min(this.options.maxZoom, zoomLevel));
    return this.panZoom.scaleTo(clampedZoom, options);
  }

  toObject(): { nodes: Node[]; edges: Edge[]; viewport: Viewport } {
    return {
      nodes: this.getNodes(),
      edges: this.getEdges(),
      viewport: this.getViewport(),
    };
  }

  destroy(): void {
    if (this.panZoom) {
      this.panZoom.destroy?.();
    }
    if (this.viewportElement && this.viewportElement.parentNode) {
      this.viewportElement.parentNode.removeChild(this.viewportElement);
    }
  }

  // 状态管理方法（供 Handle 组件使用）
  getState(): FlowState {
    return { ...this.state };
  }

  setState(updates: Partial<FlowState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyConnectionChange();
  }

  getConnectionState(): ConnectionStateInternal {
    return { ...this.connectionState };
  }

  setConnectionState(updates: Partial<ConnectionStateInternal>): void {
    this.connectionState = { ...this.connectionState, ...updates };
    this.notifyConnectionChange();
  }

  private notifyConnectionChange(): void {
    if (this.container) {
      this.container.dispatchEvent(
        new CustomEvent('xyflow-connection-change', {
          bubbles: true,
        })
      );
    }
  }

  /**
   * 更新节点查找表
   */
  private updateNodeLookup(): void {
    this.nodeLookup.clear();
    this.nodes.forEach((node) => {
      this.nodeLookup.set(node.id, {
        id: node.id,
        position: node.position,
        width: node.width || 0,
        height: node.height || 0,
        data: node.data || {},
      } as any);
    });
    this.state.nodeLookup = this.nodeLookup;
  }
}
