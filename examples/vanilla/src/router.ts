/**
 * 简单的路由系统
 * 使用 URL hash 进行导航
 */

export interface Route {
  name: string;
  path: string;
  component: () => void;
}

const routes: Route[] = [];

export function registerRoute(route: Route) {
  routes.push(route);
}

export function getRoute(path: string): Route | undefined {
  return routes.find((r) => r.path === path);
}

export function getAllRoutes(): Route[] {
  return routes;
}

export function navigate(path: string) {
  window.location.hash = path;
}

export function getCurrentPath(): string {
  return window.location.hash.slice(1) || '/';
}

export function initRouter(onRouteChange: (route: Route | undefined) => void) {
  const handleHashChange = () => {
    const path = getCurrentPath();
    const route = getRoute(path);
    onRouteChange(route);
  };

  window.addEventListener('hashchange', handleHashChange);
  handleHashChange(); // 初始加载
}
