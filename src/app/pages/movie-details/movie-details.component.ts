import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageHeaderComponent } from "../../components/page-header/page-header.component";
import { TmdbService, Movie } from '../../services/tmdb.service';
import { FavoritesService } from '../../services/favorites.service';
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";
import { TrailerModalComponent } from '../../components/trailer-modal/trailer-modal.component';
import { CastSliderComponent } from '../../components/cast-slider/cast-slider.component';
import { Breadcrumb } from '../../models/interfaces';
import { CommonModule } from '@angular/common';
import { MoviesSliderComponent } from "../../components/movies-slider/movies-slider.component";

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [
    PageHeaderComponent,
    BreadcrumbComponent,
    TrailerModalComponent,
    CommonModule,
    CastSliderComponent,
    MoviesSliderComponent
  ],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movie?: Movie;
  banner?: string | null;
  breadcrumbsArray: Breadcrumb[] = [];
  actors: any[] = [];
  recommendedMovies: any[] = [];
  isLoadingRecommendations = true;

  // Controle do modal
  showTrailer = false;
  trailerUrl: string | null = null;

  // Controle do popup
  showPopup = false;
  popupMessage = '';

  constructor(
    private tmdbService: TmdbService,
    private route: ActivatedRoute,
    public favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;

      const numericId = Number(id);
      this.loadMovieDetails(numericId);
      this.loadMovieCredits(numericId);
      this.loadRecommendations(numericId);
    });
  }

  private loadMovieDetails(id: number) {
    this.tmdbService.getMovieDetails(id).subscribe({
      next: (movie) => {
        this.movie = movie;
        this.banner = movie.backdrop_path
          ? 'https://image.tmdb.org/t/p/original' + movie.backdrop_path
          : null;

        this.breadcrumbsArray = [
          { label: 'Home', url: '/' },
          { label: 'Categorias', url: '/categorias' },
          { label: 'Filmes', url: '/categorias' },
          { label: movie.title, url: '' },
        ];
      },
      error: () => this.showPopupMessage('Erro ao carregar detalhes do filme')
    });
  }

  private loadMovieCredits(id: number) {
    this.tmdbService.getMovieCredits(id).subscribe({
      next: (credits) => {
        this.actors = credits.cast
          .filter((a: any) => a.profile_path)
          .slice(0, 15);
      },
      error: () => this.showPopupMessage('Erro ao carregar elenco')
    });
  }

  private loadRecommendations(id: number) {
    this.isLoadingRecommendations = true;
    this.tmdbService.getMovieRecommendations(id).subscribe({
      next: (recommendations) => {
        this.recommendedMovies = recommendations.results.slice(0, 20);
        this.isLoadingRecommendations = false;
      },
      error: () => {
        this.isLoadingRecommendations = false;
        this.showPopupMessage('Erro ao carregar recomendações');
      }
    });
  }

  get genres() {
    return this.movie?.genres ?? [];
  }

  openTrailer() {
    if (!this.movie) return;

    this.tmdbService.getMovieVideos(this.movie.id).subscribe({
      next: (videos) => {
        const trailer = videos.find(
          (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
        );

        if (trailer) {
          this.trailerUrl = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
          this.showTrailer = true;
        } else {
          this.showPopupMessage('Trailer não disponível para este filme');
        }
      },
      error: () => this.showPopupMessage('Erro ao carregar trailer')
    });
  }

  closeTrailer() {
    this.showTrailer = false;
    this.trailerUrl = null;
  }

  showPopupMessage(message: string) {
    this.popupMessage = message;
    this.showPopup = true;
    setTimeout(() => (this.showPopup = false), 3000);
  }

  toggleFavorite(movie: Movie) {
    if (this.favoritesService.isFavorite(movie.id)) {
      this.favoritesService.removeFavorite(movie.id);
    } else {
      this.tmdbService.getMovieDetails(movie.id).subscribe(fullMovie => {
        this.favoritesService.addFavorite(fullMovie);
      });
    }
  }
}
