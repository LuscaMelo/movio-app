import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageHeaderComponent } from "../../components/page-header/page-header.component";
import { TmdbService, Movie } from '../../services/tmdb.service';
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";
import { Breadcrumb } from '../../models/interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [PageHeaderComponent, BreadcrumbComponent, CommonModule],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {

  movie?: Movie;
  banner?: string | null;
  breadcrumbsArray: Breadcrumb[] = [];

  constructor(private tmdbService: TmdbService, private route: ActivatedRoute) {}

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
}
