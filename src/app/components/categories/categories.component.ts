import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmdbService, Movie } from '../../services/tmdb.service';
import { forkJoin } from 'rxjs';

interface GenreWithMovies {
  id: number;
  name: string;
  movies: Movie[];
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  genres: GenreWithMovies[] = [];
  isLoading = true;
  skeletons = Array(5);

  @ViewChild('sliderRef') sliderRef!: ElementRef<HTMLDivElement>;

  constructor(private tmdbService: TmdbService) {}

  ngOnInit() {
    this.tmdbService.getGenres().subscribe(genres => {
      const requests = genres.map(genre => this.tmdbService.getMoviesByGenre(genre.id));

      forkJoin(requests).subscribe(results => {
        this.genres = genres.map((genre, i) => ({
          id: genre.id,
          name: genre.name,
          movies: results[i]
        }));
        this.isLoading = false;
      });
    });
  }

  private getSlideStep(): number {
  const slider = this.sliderRef.nativeElement;
  const slide = slider.querySelector('div');
  if (!slide) return 320;

  // largura do slide
  const slideWidth = slide.offsetWidth;

  // pega o gap do container via getComputedStyle
  const sliderStyles = getComputedStyle(slider);
  const gap = sliderStyles.gap ? parseFloat(sliderStyles.gap) : 16;

  return slideWidth + gap;
}

scrollLeft() {
  this.sliderRef.nativeElement.scrollBy({
    left: -this.getSlideStep(),
    behavior: 'smooth'
  });
}

scrollRight() {
  this.sliderRef.nativeElement.scrollBy({
    left: this.getSlideStep(),
    behavior: 'smooth'
  });
}

isAtStart = true;
isAtEnd = false;

private updateNavigationState() {
  const slider = this.sliderRef.nativeElement;
  this.isAtStart = slider.scrollLeft === 0;
  this.isAtEnd = Math.ceil(slider.scrollLeft + slider.clientWidth) >= slider.scrollWidth;
}

onScroll() {
  this.updateNavigationState();
}

ngAfterViewInit() {
  this.updateNavigationState();
}
}
