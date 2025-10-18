import { Component } from '@angular/core';
import { BannerComponent } from '../../components/banner/banner.component';
import { CategoriesComponent } from '../../components/categories/categories.component';
import { TopRated } from '../../components/top-rated/top-rated.component';
import { MoviesSliderComponent } from '../../components/movies-slider/movies-slider.component';
import { Movie, TmdbService } from '../../services/tmdb.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ BannerComponent, CategoriesComponent, TopRated, MoviesSliderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
nowPlaying: Movie[] = [];
  popular: Movie[] = [];
  upcoming: Movie[] = [];
  trending: Movie[] = [];

  isLoadingNowPlaying = true;
  isLoadingPopular = true;
  isLoadingUpcoming = true;
  isLoadingTrending = true;

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

    this.tmdbService.getTrendingMovies().subscribe(res => {
      this.trending = res.results;
      this.isLoadingTrending = false;
    });
  }
}
