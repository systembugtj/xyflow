/**
 * 路由配置
 */
export interface Route {
  name: string;
  path: string;
  loader: () => Promise<{ default: () => { destroy?: () => void } }>;
}

const routes: Route[] = [
  {
    name: 'Basic',
    path: '/basic',
    loader: () => import('../examples/Basic/index.ts'),
  },
  {
    name: 'Backgrounds',
    path: '/backgrounds',
    loader: () => import('../examples/Backgrounds/index.ts'),
  },
  {
    name: 'Empty',
    path: '/empty',
    loader: () => import('../examples/Empty/index.ts'),
  },
];

export default routes;
