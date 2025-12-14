/**
 * 路由配置
 */
import { registerRoute } from './router';
import { init as initBasic } from './examples/Basic';
import { init as initEmpty } from './examples/Empty';
import { init as initBackgrounds } from './examples/Backgrounds';

// 注册路由
registerRoute({ name: 'Basic', path: '/', component: initBasic });
registerRoute({ name: 'Basic', path: '/basic', component: initBasic });
registerRoute({ name: 'Empty', path: '/empty', component: initEmpty });
registerRoute({ name: 'Backgrounds', path: '/backgrounds', component: initBackgrounds });
