import MainLayout from '../layout';
// GeneralViews
import Home from '../pages/Home';

export const dashboardRoutes = [
  {
    path: '/',
    component: Home,
    name: "Home",
    icon: "shop",
    showAlways: true,
  },
];
export const baseRoutes = [
  {
    path: '/',
    component: MainLayout,
    name: "Main Layout",
  },
];