import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmdbService } from '../../services/tmdb.service';
import { Router, RouterModule } from '@angular/router';

interface Banner {
  id: number;
  image: string;
  poster?: string;
  title: string;
  year: string;
  imdb: number;
  description: string;
  duration?: string;
  genre?: string;
  average: string;
}

@Component({
  selector: 'app-top-rated',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './top-rated.component.html',
  styleUrls: ['./top-rated.component.css'],
})
export class TopRated implements OnInit {
  banners: Banner[] = [];
  activeIndex = 0;

  // Para controlar qual imagem está visível: 0 ou 1
  visibleImageIndex = 0;

  // URLs das imagens para as duas camadas
  images: string[] = ['', ''];

  // Para controlar quando cada imagem terminou de carregar
  imageLoaded = [false, false];

  constructor(private tmdb: TmdbService, private router: Router) {}

  ngOnInit(): void {
    this.tmdb.getTopRatedMovies().subscribe((res) => {
      this.banners = res.results
        .slice(0, 6)
        .map((movie) => ({
          id: movie.id,
          image: movie.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : 'assets/default-banner.jpg',
          poster: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'assets/default-poster.jpg',
          title: movie.title,
          year: movie.release_date?.slice(0, 4) || '',
          imdb: movie.vote_average,
          description: movie.overview,
          duration: movie.runtime ? `${movie.runtime} min` : '',
          genre: movie.genre_ids?.map((id) => this.mapGenre(id)).join(', ') || '',
          average: movie.vote_average.toFixed(1),
        }));

      // Inicializa as duas imagens com o primeiro banner
      if (this.banners.length > 0) {
        this.images[0] = this.banners[0].image;
        this.imageLoaded[0] = false;
        this.imageLoaded[1] = false;
      }
    });
  }

  // Chama quando clicar no poster para trocar o banner
  setActiveIndex(index: number) {
    if (index === this.activeIndex) return;

    // Alterna qual imagem está visível: 0 ou 1
    const nextImageIndex = 1 - this.visibleImageIndex;

    // Seta a nova imagem na camada oculta
    this.images[nextImageIndex] = this.banners[index].image;

    // Marca como não carregada ainda
    this.imageLoaded[nextImageIndex] = false;

    // Atualiza o índice ativo (para texto etc)
    this.activeIndex = index;

    // Depois que a nova imagem carregar, o fade acontece no template
    this.visibleImageIndex = nextImageIndex;
  }

  // Quando uma das imagens terminar de carregar
  onImageLoad(index: number) {
    this.imageLoaded[index] = true;
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
}
