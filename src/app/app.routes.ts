import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CategoriesComponent } from './pages/categories/categories.component';

export const routes: Routes = [
    {
    path: '',
    component: HomeComponent,
    data: { breadcrumb: 'Início' },
  },
  {
    path: 'categorias',
    component: CategoriesComponent,
    data: { breadcrumb: 'Categorias' },
  },
];
