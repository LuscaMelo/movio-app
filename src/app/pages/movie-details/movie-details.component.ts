import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageHeaderComponent } from "../../components/page-header/page-header.component";
import { TmdbService, Movie } from '../../services/tmdb.service';
import { FavoritesService } from '../../services/favorites.service';
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";
import { TrailerModalComponent } from '../../components/trailer-modal/trailer-modal.component'
import { Breadcrumb } from '../../models/interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [
    PageHeaderComponent,
    BreadcrumbComponent,
    TrailerModalComponent,
    CommonModule
  ],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movie?: Movie;
  banner?: string | null;
  breadcrumbsArray: Breadcrumb[] = [];

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
      if (id) {
        const numericId = Number(id);
        this.tmdbService.getMovieDetails(numericId).subscribe(movie => {
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
        });
      }
    });
  }

  get genres() {
    return this.movie?.genres ?? [];
  }

  // Abre o modal se houver trailer
  openTrailer() {
    if (!this.movie) return;

    this.tmdbService.getMovieVideos(this.movie.id).subscribe(videos => {
      const trailer = videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');

      if (trailer) {
        this.trailerUrl = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
        this.showTrailer = true;
      } else {
        this.showPopupMessage('Trailer não disponível para este filme');
      }
    });
  }

  // Fecha o modal
  closeTrailer() {
    this.showTrailer = false;
    this.trailerUrl = null;
  }

  // Exibe popup temporário
  showPopupMessage(message: string) {
    this.popupMessage = message;
    this.showPopup = true;

    setTimeout(() => {
      this.showPopup = false;
    }, 3000); // Fecha automaticamente após 3s
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
