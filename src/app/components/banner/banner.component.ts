import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmdbService } from '../../services/tmdb.service';
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

  constructor(private tmdb: TmdbService, private router: Router) {}

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
    this.imageLoaded = false; // reset antes de trocar
    this.activeIndex = (this.activeIndex + 1) % this.banners.length;
  }, 15000);
}

  private restartAutoplay() {
    clearInterval(this.autoplayInterval);
    this.startAutoplay();
  }

  prevBanner() {
  if (this.banners.length === 0) return;

  this.imageLoaded = false; // <-- resetar antes de trocar
  this.activeIndex =
    (this.activeIndex - 1 + this.banners.length) % this.banners.length;
  this.restartAutoplay();
}

nextBanner() {
  if (this.banners.length === 0) return;

  this.imageLoaded = false; // <-- resetar antes de trocar
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

  showTrailerModal = false;
trailerUrl: string | null = null;

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
    alert('Trailer não disponível para este título.');
  }
});

}

closeTrailerModal() {
  this.showTrailerModal = false;
  this.trailerUrl = null;
}
}
