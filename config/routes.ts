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
    path: '/shuttlebus',
    name: 'shuttlebus',
    icon: 'form',
    component: './ShuttleBus',
  },
  {
    path: '/',
    redirect: '/user/login',
  },
  {
    component: './404',
  },
];
