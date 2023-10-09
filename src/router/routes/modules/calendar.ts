import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const calendar: AppRouteModule = {
  path: '/calendar',
  name: 'Calendar',
  component: LAYOUT,
  redirect: '/calendar/index',
  meta: {
    icon: 'simple-icons:about-dot-me',
    title: t('routes.dashboard.about'),
    ignoreAuth: true,
  },
  children: [
    {
      path: 'index',
      name: 'CalendarDemo',
      component: () => import('/@/views/calendar/index.vue'),
      meta: {
        title: t('routes.dashboard.about'),
        icon: 'simple-icons:about-dot-me',
        ignoreAuth: true,
      },
    },
  ],
};

export default calendar;
