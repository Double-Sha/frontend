export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/map',
    name: 'map',
    icon: 'user',
    component: './Map',
  },
  {
    name: 'employee',
    icon: 'table',
    path: '/employee',
    component: './Employee',
  },
  {
    path: '/Bus',
    name: 'bus',
    icon: 'form',
    routes: [
      {
        name: 'BusLine',
        path: '/Bus/BusLine',
        component: './Bus/BusLine',
      },
      {
        name: 'ShuttleBus',
        path: '/Bus/ShuttleBus',
        component: './Bus/ShuttleBus',
      },
    ],
  },
  {
    path: '/',
    redirect: '/user/login',
  },
  {
    component: './404',
  },
];
