/**
 * Basic 示例
 * 基础的 XYFlow 使用示例
 */
import '@xyflow/vanilla/dist/style.css';
import { XYFlow } from '@xyflow/vanilla';
import type { Node, Edge } from '@xyflow/vanilla';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
    className: 'light',
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
    className: 'light',
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 400, y: 100 },
    className: 'light',
  },
  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 400, y: 200 },
    className: 'light',
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];

export default function BasicExample() {
  const container = document.getElementById('flow-container');
  if (!container) {
    throw new Error('Container element not found');
  }

  // 清空容器
  container.innerHTML = '';

  // 创建 XYFlow 实例
  const flow = new XYFlow({
    container,
    nodes: initialNodes,
    edges: initialEdges,
    minZoom: 0.2,
    maxZoom: 4,
  });

  // 初始化
  flow.fitView();

  // 添加背景
  const background = document.createElement('xyflow-background');
  background.setAttribute('variant', 'dots');
  background.setAttribute('gap', '20');
  container.appendChild(background);

  // 添加控制按钮
  const controls = document.createElement('xyflow-controls');
  controls.setAttribute('position', 'bottom-left');
  container.appendChild(controls);

  // 添加小地图
  const minimap = document.createElement('xyflow-minimap');
  container.appendChild(minimap);

  // 控制按钮事件
  const addNodeBtn = document.getElementById('add-node');
  if (addNodeBtn) {
    addNodeBtn.onclick = () => {
      const newNode: Node = {
        id: `${Date.now()}`,
        data: { label: `Node ${Date.now()}` },
        position: {
          x: Math.random() * 400,
          y: Math.random() * 400,
        },
        className: 'light',
      };
      flow.addNodes([newNode]);
      flow.fitView();
    };
  }

  const fitViewBtn = document.getElementById('fit-view');
  if (fitViewBtn) {
    fitViewBtn.onclick = () => flow.fitView();
  }

  const zoomInBtn = document.getElementById('zoom-in');
  if (zoomInBtn) {
    zoomInBtn.onclick = () => flow.zoomIn();
  }

  const zoomOutBtn = document.getElementById('zoom-out');
  if (zoomOutBtn) {
    zoomOutBtn.onclick = () => flow.zoomOut();
  }

  const resetViewBtn = document.getElementById('reset-view');
  if (resetViewBtn) {
    resetViewBtn.onclick = () => flow.setViewport({ x: 0, y: 0, zoom: 1 });
  }

  return {
    flow,
    destroy: () => {
      flow.destroy();
    },
  };
}
