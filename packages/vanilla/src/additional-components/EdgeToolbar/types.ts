/**
 * EdgeToolbar 类型定义
 * 完全按照 React 端设计实现
 */
import type { EdgeToolbarBaseProps } from '@xyflow/system';

/**
 * @inline
 */
export type EdgeToolbarProps = EdgeToolbarBaseProps & {
  /**
   * An edge toolbar must be attached to an edge.
   */
  edgeId: string;
  children?: string;
  className?: string;
  style?: Partial<CSSStyleDeclaration> | string;
  isVisible?: boolean;
  alignX?: 'start' | 'center' | 'end';
  alignY?: 'start' | 'center' | 'end';
  [key: string]: any;
};
