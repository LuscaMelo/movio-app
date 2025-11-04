import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TmdbService, Movie } from '../../services/tmdb.service';
import { PageHeaderComponent } from "../../components/page-header/page-header.component";
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";
import { Breadcrumb } from '../../models/interfaces';

@Component({
  selector: 'app-now-playing',
  standalone: true,
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.css'],
  imports: [PageHeaderComponent, BreadcrumbComponent],
})
export class NowPlayingComponent implements OnInit {
  banner?: string | null;
  title = 'Em cartaz';
  movies: Movie[] = [];
  isLoading = true;
  skeletons = Array(6);

  breadcrumbsArray: Breadcrumb[] = [
    { label: 'Home', url: '/' },
    { label: 'Filmes', url: '/categorias' },
    { label: 'Em cartaz', url: '/em-cartaz' }
  ];

  constructor(private tmdbService: TmdbService, private router: Router) {}

  ngOnInit() {
    this.tmdbService.getNowPlayingMovies().subscribe((response) => {
      this.movies = response.results;
      this.isLoading = false;

      const withBackdrop = this.movies.filter(m => !!m.backdrop_path);
      if (withBackdrop.length > 0) {
        const randomMovie = withBackdrop[Math.floor(Math.random() * withBackdrop.length)];
        this.banner = 'https://image.tmdb.org/t/p/original' + randomMovie.backdrop_path;
      } else {
        this.banner = null;
      }
    });
  }

  goToDetails(id: number) {
    this.router.navigate(['/filme', id]);
  }
}
