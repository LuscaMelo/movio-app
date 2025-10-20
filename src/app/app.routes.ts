import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { CategoryComponent } from './pages/category/category.component';

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
  {
    path: 'categorias/:categoria',
    component: CategoryComponent,
    data: { breadcrumb: 'Categoria' },
  },
  {
    path: 'filme/:id',
    component: MovieDetailsComponent,
    data: { breadcrumb: 'Detalhes do filme' },
  }
];

