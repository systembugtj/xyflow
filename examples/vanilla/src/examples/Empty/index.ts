/**
 * Empty 示例
 * 空画布，可以动态添加节点
 */
import '@xyflow/vanilla/dist/style.css';
import { XYFlow, addEdge } from '@xyflow/vanilla';
import type { Node, Edge, Connection } from '@xyflow/vanilla';

export default function EmptyExample() {
  const container = document.getElementById('flow-container');
  if (!container) {
    throw new Error('Container element not found');
  }

  // 清空容器
  container.innerHTML = '';

  // 创建空的 XYFlow 实例
  const flow = new XYFlow({
    container,
    nodes: [],
    edges: [],
  });

  // 添加背景
  const background = document.createElement('xyflow-background');
  background.setAttribute('variant', 'lines');
  container.appendChild(background);

  // 添加控制按钮
  const controls = document.createElement('xyflow-controls');
  container.appendChild(controls);

  // 连接处理
  flow.on('connect', (connection: Connection) => {
    const edges = flow.getEdges();
    flow.setEdges(addEdge(connection, edges));
  });

  // 添加节点按钮
  const addNodeBtn = document.getElementById('add-node');
  if (addNodeBtn) {
    addNodeBtn.onclick = () => {
      const nodeId = (flow.getNodes().length + 1).toString();
      const newNode: Node = {
        id: nodeId,
        data: { label: `Node: ${nodeId}` },
        position: {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        },
      };
      flow.addNodes([newNode]);
    };
  }

  return {
    flow,
    destroy: () => {
      flow.destroy();
    },
  };
}
