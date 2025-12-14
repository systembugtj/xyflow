# @xyflow/vanilla

Vanilla Flow - 一个框架无关的库，用于构建基于节点的编辑器和交互式流程图。

## 安装

```bash
npm install @xyflow/vanilla
# 或
pnpm add @xyflow/vanilla
# 或
yarn add @xyflow/vanilla
```

## 基本使用

```typescript
import { XYFlow, type Node, type Edge } from '@xyflow/vanilla';
import '@xyflow/vanilla/dist/style.css';

// 获取容器元素
const container = document.getElementById('flow-container')!;

// 定义初始节点和边
const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: '节点 1' },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    data: { label: '节点 2' },
    position: { x: 200, y: 100 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
];

// 创建 XYFlow 实例
const flow = new XYFlow({
  container,
  nodes: initialNodes,
  edges: initialEdges,
  minZoom: 0.2,
  maxZoom: 4,
});

// 适应视图
flow.fitView();
```

## API

### XYFlow 类

#### 构造函数选项

```typescript
interface XYFlowOptions {
  container: HTMLElement;        // 容器元素
  nodes?: Node[];                // 初始节点
  edges?: Edge[];                // 初始边
  viewport?: Viewport;           // 初始视口
  minZoom?: number;              // 最小缩放级别（默认 0.5）
  maxZoom?: number;              // 最大缩放级别（默认 2）
  panOnDrag?: boolean;           // 是否启用平移（默认 true）
  zoomOnScroll?: boolean;         // 是否启用滚轮缩放（默认 true）
  zoomOnDoubleClick?: boolean;   // 是否启用双击缩放（默认 true）
  nodesDraggable?: boolean;      // 节点是否可拖拽（默认 true）
  nodesConnectable?: boolean;     // 节点是否可连接（默认 true）
  elementsSelectable?: boolean;  // 元素是否可选择（默认 true）
}
```

#### 实例方法

- `setNodes(nodes: Node[] | ((nodes: Node[]) => Node[]))` - 设置节点
- `getNodes(): Node[]` - 获取所有节点
- `setEdges(edges: Edge[] | ((edges: Edge[]) => Edge[]))` - 设置边
- `getEdges(): Edge[]` - 获取所有边
- `addNodes(nodes: Node[])` - 添加节点
- `addEdges(edges: Edge[])` - 添加边
- `deleteElements(params: { nodes?: Node[]; edges?: Edge[] })` - 删除元素
- `updateNodeData(nodeId: string, data: Record<string, unknown>)` - 更新节点数据
- `getViewport(): Viewport` - 获取当前视口
- `setViewport(viewport: Viewport, options?: ViewportHelperFunctionOptions): Promise<boolean>` - 设置视口
- `fitView(options?: FitBoundsOptions): Promise<boolean>` - 适应视图
- `setCenter(x: number, y: number, options?: SetCenterOptions): Promise<boolean>` - 设置中心点
- `getZoom(): number` - 获取当前缩放级别
- `zoomIn(options?: ViewportHelperFunctionOptions): Promise<boolean>` - 放大
- `zoomOut(options?: ViewportHelperFunctionOptions): Promise<boolean>` - 缩小
- `zoomTo(zoomLevel: number, options?: ViewportHelperFunctionOptions): Promise<boolean>` - 缩放到指定级别
- `toObject(): { nodes: Node[]; edges: Edge[]; viewport: Viewport }` - 转换为对象
- `destroy()` - 销毁实例

## 特性

- ✅ 节点拖拽
- ✅ 视图平移和缩放
- ✅ 滚轮缩放
- ✅ 双击缩放
- ✅ 添加/删除节点和边
- ✅ 适应视图
- ✅ 框架无关（纯 JavaScript/TypeScript）

## 示例

查看 [examples/vanilla](../../examples/vanilla) 目录获取完整示例。

## 许可证

MIT
