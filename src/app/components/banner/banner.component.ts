import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmdbService } from '../../services/tmdb.service';

interface Banner {
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
  imports: [CommonModule], // <-- Importante para ngFor, ngIf, ngClass
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
})
export class BannerComponent implements OnInit {
  banners: Banner[] = [];
  activeIndex = 0;
  private autoplayInterval!: any;

  constructor(private tmdb: TmdbService) {}

  ngOnInit(): void {
    this.tmdb.getPopularMovies().subscribe((res) => {
      this.banners = res.results.map((movie) => ({
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

      if (this.banners.length > 0) {
        this.startAutoplay();
      }
    });
  }

  setActiveIndex(index: number) {
    this.activeIndex = index;
    this.restartAutoplay();
  }

  private startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.activeIndex = (this.activeIndex + 1) % this.banners.length;
    }, 15000);
  }

  private restartAutoplay() {
    clearInterval(this.autoplayInterval);
    this.startAutoplay();
  }

  private mapGenre(id: number): string {
    const genres: Record<number, string> = {
      28: 'Action',
      12: 'Adventure',
      16: 'Animation',
      35: 'Comedy',
      80: 'Crime',
      99: 'Documentary',
      18: 'Drama',
      10751: 'Family',
      14: 'Fantasy',
      36: 'History',
      27: 'Horror',
      10402: 'Music',
      9648: 'Mystery',
      10749: 'Romance',
      878: 'Sci-Fi',
      10770: 'TV Movie',
      53: 'Thriller',
      10752: 'War',
      37: 'Western',
    };
    return genres[id] || 'Unknown';
  }

  prevBanner() {
    if (this.banners.length === 0) return;

    this.activeIndex =
      (this.activeIndex - 1 + this.banners.length) % this.banners.length;
    this.restartAutoplay();
  }

  nextBanner() {
    if (this.banners.length === 0) return;

    this.activeIndex = (this.activeIndex + 1) % this.banners.length;
    this.restartAutoplay();
  }

  ngOnDestroy(): void {
    clearInterval(this.autoplayInterval);
  }
}
