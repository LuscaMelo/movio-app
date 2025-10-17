import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { BannerComponent } from "./components/banner/banner.component";
import { CategoriesComponent } from './components/categories/categories.component';
import { TopRated } from "./components/top-rated/top-rated.component";
import { MoviesSliderComponent } from "./components/movies-slider/movies-slider.component";
import { Movie, TmdbService } from './services/tmdb.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, BannerComponent, CategoriesComponent, TopRated, MoviesSliderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'movio-app';

  nowPlaying: Movie[] = [];
  popular: Movie[] = [];
  upcoming: Movie[] = [];

  isLoadingNowPlaying = true;
  isLoadingPopular = true;
  isLoadingUpcoming = true;

  constructor(private tmdbService: TmdbService) {}

  ngOnInit() {
    this.tmdbService.getNowPlayingMovies().subscribe(res => {
      this.nowPlaying = res.results;
      this.isLoadingNowPlaying = false;
    });

    this.tmdbService.getPopularMovies().subscribe(res => {
      this.popular = res.results;
      this.isLoadingPopular = false;
    });

    this.tmdbService.getUpcomingMovies().subscribe(res => {
      this.upcoming = res.results;
      this.isLoadingUpcoming = false;
    });
  }
}
