import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { CategoryComponent } from './pages/category/category.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { TopRatedComponent } from './pages/top-rated/top-rated.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { PopularComponent } from './pages/popular/popular.component';
import { TrendingComponent } from './pages/trending/trending.component';
import { NowPlayingComponent } from './pages/now-playing/now-playing.component';
import { UpcomingComponent } from './pages/upcoming/upcoming.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'favoritos',
    component: FavoritesComponent,
  },
  {
    path: 'mais-populares',
    component: PopularComponent,
  },
  {
    path: 'tendencias-da-semana',
    component: TrendingComponent,
  },
  {
    path: 'em-cartaz',
    component: NowPlayingComponent,
  },
  {
    path: 'em-breve',
    component: UpcomingComponent,
  },
  {
    path: 'categorias',
    component: CategoriesComponent,
  },
  {
    path: 'categorias/:categoria',
    component: CategoryComponent,
  },
  {
    path: 'filme/:id',
    component: MovieDetailsComponent,
  },
  {
    path: 'buscar',
    component: SearchResultsComponent,
  },
  {
    path: 'mais-bem-avaliados',
    component: TopRatedComponent,
  },

];

