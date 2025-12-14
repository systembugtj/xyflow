/**
 * Backgrounds 示例
 * 展示不同的背景样式
 */
import '@xyflow/vanilla/dist/style.css';
import { XYFlow } from '@xyflow/vanilla';
import { BackgroundVariant } from '@xyflow/vanilla';
import type { Node } from '@xyflow/vanilla';

const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'Node 1' },
    position: { x: 50, y: 50 },
  },
];

export default function BackgroundsExample() {
  const container = document.getElementById('flow-container');
  if (!container) {
    throw new Error('Container element not found');
  }

  // 清空容器
  container.innerHTML = '';

  // 创建多个流实例展示不同背景
  const flows = [
    { id: 'flow-a', variant: BackgroundVariant.Dots },
    { id: 'flow-b', variant: BackgroundVariant.Lines, gap: [50, 50] },
    { id: 'flow-c', variant: BackgroundVariant.Cross, gap: [100, 50] },
  ];

  const wrapper = document.createElement('div');
  wrapper.style.display = 'grid';
  wrapper.style.gridTemplateColumns = 'repeat(2, 1fr)';
  wrapper.style.gap = '20px';
  wrapper.style.padding = '20px';
  wrapper.style.height = '100%';

  flows.forEach((config) => {
    const flowContainer = document.createElement('div');
    flowContainer.id = config.id;
    flowContainer.style.width = '100%';
    flowContainer.style.height = '100%';
    flowContainer.style.border = '1px solid #ddd';
    flowContainer.style.borderRadius = '4px';

    const flow = new XYFlow({
      container: flowContainer,
      nodes: initialNodes,
      edges: [],
    });

    const background = document.createElement('xyflow-background');
    background.setAttribute('variant', config.variant);
    if (config.gap) {
      background.setAttribute('gap', JSON.stringify(config.gap));
    }
    flowContainer.appendChild(background);

    wrapper.appendChild(flowContainer);
  });

  container.appendChild(wrapper);

  return {
    destroy: () => {
      // 清理逻辑
    },
  };
}
