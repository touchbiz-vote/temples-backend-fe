import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const print: AppRouteModule = {
  path: '/print',
  name: 'Print',
  component: LAYOUT,
  redirect: '/print/index',
  meta: {
    icon: 'simple-icons:about-dot-me',
    title: t('routes.dashboard.about'),
    ignoreAuth: true,
  },
  children: [
    {
      path: 'index',
      name: 'PrintDemo',
      component: () => import('/@/views/print/index.vue'),
      meta: {
        title: t('routes.dashboard.about'),
        icon: 'simple-icons:about-dot-me',
        ignoreAuth: true,
      },
    },
  ],
};

export default print;
