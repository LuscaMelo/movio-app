import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TmdbService, Movie } from '../../services/tmdb.service';
import { PageHeaderComponent } from "../../components/page-header/page-header.component";
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";
import { Breadcrumb } from '../../models/interfaces';
import { CommonModule } from '@angular/common';
import { MoviesSliderComponent } from "../../components/movies-slider/movies-slider.component";

@Component({
  selector: 'app-search-results',
  standalone: true,
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  imports: [CommonModule, PageHeaderComponent, BreadcrumbComponent, RouterModule, MoviesSliderComponent]
})
export class SearchResultsComponent implements OnInit {
  banner?: string | null;
  query = '';
  movies: Movie[] = [];
  isLoading = true;
  popular: Movie[] = [];
  isLoadingPopular = true;
  skeletons = Array(6);

  breadcrumbsArray: Breadcrumb[] = [
    { label: 'Home', url: '/' },
    { label: 'Buscar por filme', url: '/categorias' },
    { label: '', url: '' }
  ];

  readonly defaultBanner = '/public/logo.png';

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService,
    private router: Router
  ) {}

  ngOnInit() {
    // Carregar filmes populares primeiro
    this.tmdbService.getPopularMovies().subscribe(res => {
      this.popular = res.results;
      this.isLoadingPopular = false;
    });

    // Observar mudanças na query da URL
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      if (this.query) {
        this.breadcrumbsArray[2].label = this.query;
        this.searchMovies();
      }
    });
  }

  searchMovies() {
    this.isLoading = true;
    this.tmdbService.searchMovies(this.query).subscribe({
      next: (res) => {
        this.movies = res.results || [];
        this.isLoading = false;

        if (this.movies.length > 0) {
          // Se houver resultados, usa um banner aleatório entre eles
          const withBackdrop = this.movies.filter(m => !!m.backdrop_path);
          if (withBackdrop.length > 0) {
            const randomMovie = withBackdrop[Math.floor(Math.random() * withBackdrop.length)];
            this.banner = 'https://image.tmdb.org/t/p/original' + randomMovie.backdrop_path;
          } else {
            this.banner = this.defaultBanner;
          }
        } else {
          // Se não houver resultados, usa um banner aleatório de filmes populares
          const withBackdropPopular = this.popular.filter(m => !!m.backdrop_path);
          if (withBackdropPopular.length > 0) {
            const randomPopular = withBackdropPopular[Math.floor(Math.random() * withBackdropPopular.length)];
            this.banner = 'https://image.tmdb.org/t/p/original' + randomPopular.backdrop_path;
          } else {
            this.banner = this.defaultBanner;
          }
        }
      },
      error: (err) => {
        console.error('Erro ao buscar filmes:', err);
        this.isLoading = false;

        // Fallback: banner popular ou padrão
        const withBackdropPopular = this.popular.filter(m => !!m.backdrop_path);
        if (withBackdropPopular.length > 0) {
          const randomPopular = withBackdropPopular[Math.floor(Math.random() * withBackdropPopular.length)];
          this.banner = 'https://image.tmdb.org/t/p/original' + randomPopular.backdrop_path;
        } else {
          this.banner = this.defaultBanner;
        }
      }
    });
  }

  goToDetails(id: number) {
    this.router.navigate(['/filme', id]);
  }
}
