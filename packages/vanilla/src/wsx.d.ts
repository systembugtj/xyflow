/**
 * TypeScript 类型声明：支持 .wsx 文件导入
 * 告诉 TypeScript 将 .wsx 文件视为可导入的模块
 * .wsx 文件导出 default class，继承自 LightComponent
 */
declare module '*.wsx' {
  import type { LightComponent } from '@wsxjs/wsx-core';

  // .wsx 文件导出一个默认的类，继承自 LightComponent
  class WSXComponent extends LightComponent {}

  export default WSXComponent;
}

/**
 * 修复 @state 装饰器的类型定义
 * 新版本的装饰器提案（2023-05）支持返回 DecoratorContext
 * 使用 void 作为返回类型，因为装饰器通常不返回值
 */
declare module '@wsxjs/wsx-core' {
  // 根据新装饰器提案，装饰器可以返回 void 或替换值
  // 使用 void 作为主要返回类型，符合装饰器的常见用法
  export function state<T>(target: undefined, context: ClassFieldDecoratorContext<T>): (value: T) => T | void;
}
