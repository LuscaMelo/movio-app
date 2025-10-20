import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TmdbService, Movie } from '../../services/tmdb.service';
import { PageHeaderComponent } from "../../components/page-header/page-header.component";
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";
import { Breadcrumb } from '../../models/interfaces';

@Component({
  selector: 'app-category',
  standalone: true,
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  imports: [PageHeaderComponent, BreadcrumbComponent],
})
export class CategoryComponent implements OnInit {
  banner?: string | null;
  genreName = '';
  movies: Movie[] = [];
  isLoading = true;
  skeletons = Array(6);

  breadcrumbsArray: Breadcrumb[] = [
    { label: 'Home', url: '/' },
    { label: 'Categorias', url: '/categorias' },
    { label: '', url: '' } // será preenchido dinamicamente
  ];

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService,
    private router: Router
  ) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('categoria');
    if (!slug) return;

    // Buscar gêneros para encontrar o ID a partir do slug
    this.tmdbService.getGenres().subscribe((genres) => {
      const matchedGenre = genres.find((g) => this.slugify(g.name) === slug);
      if (!matchedGenre) return;

      this.genreName = matchedGenre.name;

      // Atualiza breadcrumb com o nome real do gênero
      this.breadcrumbsArray[2].label = this.genreName;

      // Buscar os filmes da categoria
      this.tmdbService.getMoviesByGenre(matchedGenre.id).subscribe((movies) => {
        this.movies = movies;
        this.isLoading = false;

        // Escolher um filme com backdrop para o banner (aleatório)
        const withBackdrop = movies.filter(m => !!m.backdrop_path);
        if (withBackdrop.length > 0) {
          const randomMovie = withBackdrop[Math.floor(Math.random() * withBackdrop.length)];
          this.banner = 'https://image.tmdb.org/t/p/original' + randomMovie.backdrop_path;
        } else {
          this.banner = null;
        }
      });
    });
  }

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

  goToDetails(id: number) {
    this.router.navigate(['/filme', id]);
  }
}
