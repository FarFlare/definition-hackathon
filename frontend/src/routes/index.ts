import MainPage from 'src/pages/main-page';
import CrowdPage from 'src/pages/crowd-page';

export const routes = [
  {
    path: '/:id',
    component: CrowdPage,
  },
  {
    path: '/',
    component: MainPage,
  },
]