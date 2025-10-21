import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { CategoryComponent } from './pages/category/category.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { TopRatedComponent } from './pages/top-rated/top-rated.component';

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
  },
  {
    path: 'buscar',
    component: SearchResultsComponent,
    data: { breadcrumb: 'Buscar' },
  },
  {
    path: 'mais-bem-avaliados',
    component: TopRatedComponent,
    data: { breadcrumb: 'Buscar' },
  },

];

