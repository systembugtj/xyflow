/** @jsxImportSource @wsxjs/wsx-core */
// 导出核心类
export { XYFlowVanilla } from './core/XYFlow';

// 直接导入 WSX 组件（确保 wsx 插件处理这些文件）
// 这些导入语句会触发 wsx 插件处理 .wsx 文件
import './components/Handle.wsx';
import './components/Panel.wsx';
import './components/EdgeLabelRenderer/EdgeLabelRenderer.wsx';
import './components/ViewportPortal/ViewportPortal.wsx';
import './components/Nodes/DefaultNode.wsx';
import './components/XYFlow.wsx';

// 导出 WSX 组件（用于类型支持）
export { default as Handle } from './components/Handle.wsx';
export { default as Panel } from './components/Panel.wsx';
export { default as EdgeLabelRenderer } from './components/EdgeLabelRenderer/EdgeLabelRenderer.wsx';
export { default as ViewportPortal } from './components/ViewportPortal/ViewportPortal.wsx';
export { default as DefaultNode } from './components/Nodes/DefaultNode.wsx';
export { default as XYFlow } from './components/XYFlow.wsx';

// 直接导入 additional-components（确保 wsx 插件处理这些文件）
import './additional-components/Background/Background.wsx';
import './additional-components/Controls/Controls.wsx';
import './additional-components/Controls/ControlButton.wsx';
import './additional-components/MiniMap/MiniMap.wsx';
import './additional-components/EdgeToolbar/EdgeToolbar.wsx';
import './additional-components/NodeToolbar/NodeToolbar.wsx';
import './additional-components/NodeToolbar/NodeToolbarPortal.wsx';
import './additional-components/NodeResizer/NodeResizer.wsx';
import './additional-components/NodeResizer/NodeResizeControl.wsx';

// 导出 additional-components（用于类型支持）
export * from './additional-components';

// 导出 Edge 工具函数（用于计算路径）
export { getSimpleBezierPath } from './components/Edges/SimpleBezierEdge';

// 导出类型
export type { Node, Edge, XYFlowOptions, XYFlowInstance } from './types';

// 重新导出 system 包的类型和工具函数
export type {
  NodeBase,
  EdgeBase,
  Viewport,
  XYPosition,
  Connection,
  Rect,
  FitBoundsOptions,
  SetCenterOptions,
  ViewportHelperFunctionOptions,
  EdgeMarkerType,
  PanelPosition,
} from '@xyflow/system';

// 重新导出工具函数和枚举值（Position 和 MarkerType 既是类型也是枚举值）
export {
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  getNodesBounds,
  getViewportForBounds,
  addEdge,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  Position,
  MarkerType,
} from '@xyflow/system';
