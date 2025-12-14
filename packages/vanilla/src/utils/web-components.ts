/**
 * Web Components 工具函数
 * 用于创建和操作 Web Components
 */

/**
 * 属性变化观察器
 */
export class AttributeObserver {
  private observer: MutationObserver;
  private callback: (name: string, oldValue: string | null, newValue: string | null) => void;

  constructor(
    element: HTMLElement,
    callback: (name: string, oldValue: string | null, newValue: string | null) => void
  ) {
    this.callback = callback;
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName) {
          const oldValue = mutation.oldValue;
          const newValue = element.getAttribute(mutation.attributeName);
          this.callback(mutation.attributeName, oldValue, newValue);
        }
      });
    });

    this.observer.observe(element, {
      attributes: true,
      attributeOldValue: true,
    });
  }

  disconnect(): void {
    this.observer.disconnect();
  }
}

/**
 * 类名工具函数（类似 classcat）
 */
export function classcat(...args: (string | Record<string, boolean> | undefined | null | boolean)[]): string {
  const classes: string[] = [];

  for (const arg of args) {
    if (!arg) continue;

    if (typeof arg === 'string') {
      classes.push(arg);
    } else if (typeof arg === 'boolean') {
      // 忽略布尔值
      continue;
    } else if (typeof arg === 'object') {
      for (const key in arg) {
        if (arg[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}
