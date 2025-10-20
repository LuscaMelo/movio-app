import { Component, signal } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router
import { PageHeaderComponent } from "../../components/page-header/page-header.component";
import { Genre, Movie, TmdbService } from '../../services/tmdb.service';
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";
import { MoviesSliderComponent } from '../../components/movies-slider/movies-slider.component';
import { forkJoin } from 'rxjs';
import { Breadcrumb } from '../../models/interfaces';

interface GenreCard {
  genre: Genre;
  backgroundImage: string | null;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [PageHeaderComponent, BreadcrumbComponent, MoviesSliderComponent],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'] // Corrigido de styleUrl para styleUrls
})
export class CategoriesComponent {

  private readonly baseImageUrl = 'https://image.tmdb.org/t/p/original';

  banner?: string | null;
  genreCards = signal<GenreCard[]>([]);
  popular: Movie[] = [];
  isLoadingPopular = true;
  isLoadingGenres = true;
  breadcrumbsArray: Breadcrumb[] = [
    { label: 'Home', url: '/' },
    { label: 'Categorias', url: '' }, 
  ];

  constructor(private tmdbService: TmdbService, private router: Router) {}

  ngOnInit() {
    // Carrega banner da home
    this.tmdbService.getPopularMovies().subscribe(res => {
      const randomIndex = Math.floor(Math.random() * res.results.length);
      this.banner = res.results[randomIndex]?.backdrop_path
        ? this.baseImageUrl + res.results[randomIndex].backdrop_path
        : null;
    });

    // Carrega gêneros com imagem de fundo aleatória
    this.tmdbService.getGenres().subscribe(genres => {
      const observables = genres.map(genre =>
        this.tmdbService.getMoviesByGenre(genre.id)
      );

      forkJoin(observables).subscribe(moviesArray => {
        const cards = genres.map((genre, i) => {
          const movies = moviesArray[i];
          const randomMovie = movies.length > 0 ? movies[Math.floor(Math.random() * movies.length)] : null;
          return {
            genre,
            backgroundImage: randomMovie && randomMovie.backdrop_path
              ? this.baseImageUrl + randomMovie.backdrop_path
              : null
          };
        });
        this.genreCards.set(cards);
        this.isLoadingGenres = false;
      });
    });

    this.tmdbService.getPopularMovies().subscribe(res => {
      this.popular = res.results;
      this.isLoadingPopular = false;
    });
  }

  get skeletons() {
    return Array.from({ length: 10 });
  }

  // Função para criar slug da categoria
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Função para navegar para categoria
  goToCategory(genreName: string) {
    const slug = this.slugify(genreName);
    this.router.navigate(['/categorias', slug]);
  }
}
