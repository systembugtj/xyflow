/**
 * 主入口文件
 * 使用 wsxjs 路由系统
 */
import '@xyflow/vanilla/dist/style.css';
import './App/App.wsx';
import './index.css';

// 初始化应用
function initApp() {
  const app = document.getElementById('app');
  if (!app) {
    throw new Error('App container not found');
  }

  // 清空应用容器
  while (app.firstChild) {
    app.removeChild(app.firstChild);
  }

  // 创建 App 根组件
  const appRoot = document.createElement('app-root');
  app.appendChild(appRoot);
}

// 等待 DOM 加载完成
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
