import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'get-started',
    pathMatch: 'full',
  },
  {
    path: 'get-started',
    loadComponent: () => import('./pages/get-started/get-started.component').then((m) => m.GetStartedComponent),
  },
  {
    path: 'builder',
    loadComponent: () =>
      import('./pages/builder/builder-shell/builder-shell.component').then((m) => m.BuilderShellComponent),
  },
];
