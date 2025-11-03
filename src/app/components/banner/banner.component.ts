import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmdbService } from '../../services/tmdb.service';
import { FavoritesService } from '../../services/favorites.service';
import { Router } from '@angular/router';
import { TrailerModalComponent } from '../trailer-modal/trailer-modal.component';

interface Banner {
  id: number;
  image: string;
  title: string;
  year: string;
  imdb: number;
  description: string;
  duration?: string;
  genre?: string;
}

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule, TrailerModalComponent],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
})
export class BannerComponent implements OnInit {
  banners: Banner[] = [];
  activeIndex = 0;
  loading = true;
  imageLoaded = false;
  private autoplayInterval!: any;

  // Modal do trailer
  showTrailerModal = false;
  trailerUrl: string | null = null;

  // Popup
  showPopup = false;
  popupMessage = '';

  constructor(
    private tmdb: TmdbService,
    private router: Router,
    public favoritesService: FavoritesService,
  ) {}

  ngOnInit(): void {
    this.tmdb.getPopularMovies().subscribe((res) => {
      this.banners = res.results.map((movie) => ({
        id: movie.id,
        image: movie.backdrop_path
          ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
          : 'assets/default-banner.jpg',
        title: movie.title,
        year: movie.release_date?.slice(0, 4) || '',
        imdb: movie.vote_average,
        description: movie.overview,
        duration: movie.runtime ? `${movie.runtime} min` : '',
        genre: movie.genre_ids?.map((id) => this.mapGenre(id)).join(', ') || '',
      }));

      this.loading = false;

      if (this.banners.length > 0) {
        this.startAutoplay();
      }
    });
  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  private startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.imageLoaded = false;
      this.activeIndex = (this.activeIndex + 1) % this.banners.length;
    }, 15000);
  }

  private restartAutoplay() {
    clearInterval(this.autoplayInterval);
    this.startAutoplay();
  }

  get isFavoriteCurrent(): boolean {
    const current = this.banners[this.activeIndex];
    return current ? this.favoritesService.isFavorite(current.id) : false;
  }

  prevBanner() {
    if (this.banners.length === 0) return;
    this.imageLoaded = false;
    this.activeIndex =
      (this.activeIndex - 1 + this.banners.length) % this.banners.length;
    this.restartAutoplay();
  }

  nextBanner() {
    if (this.banners.length === 0) return;
    this.imageLoaded = false;
    this.activeIndex = (this.activeIndex + 1) % this.banners.length;
    this.restartAutoplay();
  }

  ngOnDestroy(): void {
    clearInterval(this.autoplayInterval);
  }

  private mapGenre(id: number): string {
    const genres: Record<number, string> = {
      28: 'Ação',
      12: 'Aventura',
      16: 'Animação',
      35: 'Comédia',
      80: 'Crime',
      99: 'Documentário',
      18: 'Drama',
      10751: 'Família',
      14: 'Fantasia',
      36: 'História',
      27: 'Terror',
      10402: 'Música',
      9648: 'Mistério',
      10749: 'Romance',
      878: 'Ficção Científica',
      10770: 'Filme de TV',
      53: 'Thriller',
      10752: 'Guerra',
      37: 'Faroeste',
    };
    return genres[id] || 'Desconhecido';
  }

  goToDetails() {
    const id = this.banners[this.activeIndex].id;
    this.router.navigate(['/filme', id]);
  }

  // Abrir trailer com fallback de popup
  openTrailerModal() {
    const movieId = this.banners[this.activeIndex].id;

    this.tmdb.getMovieVideos(movieId).subscribe((videos) => {
      const trailer = videos.find(
        (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
      );

      if (trailer) {
        this.trailerUrl = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
        this.showTrailerModal = true;
      } else {
        this.showPopupMessage('Trailer não disponível para este título.');
      }
    });
  }

  closeTrailerModal() {
    this.showTrailerModal = false;
    this.trailerUrl = null;
  }

  // Popup de aviso
  showPopupMessage(message: string) {
    this.popupMessage = message;
    this.showPopup = true;
    setTimeout(() => (this.showPopup = false), 3000);
  }

  addToFavorites() {
    const currentMovie = this.banners[this.activeIndex];

    if (!this.favoritesService.isFavorite(currentMovie.id)) {
      this.favoritesService.addFavorite(currentMovie);
    } else {
      this.favoritesService.removeFavorite(currentMovie.id);
    }
  }

  toggleFavorite(movie: Banner) {
    const favorite = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.image.replace('https://image.tmdb.org/t/p/w500', ''), // ou ajuste se estiver usando poster
      overview: movie.description || 'Sem descrição disponível.',
      vote_average: movie.imdb,
      release_date: movie.year,
      backdrop_path: movie.image.replace('https://image.tmdb.org/t/p/original', ''),
    } as any;

    this.favoritesService.toggleFavorite(favorite);
  }
}
