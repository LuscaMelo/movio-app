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

  private scrollTimeout: any;

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

    const slideWidth = slide.offsetWidth;
    const sliderStyles = getComputedStyle(slider);
    const gap = sliderStyles.gap ? parseFloat(sliderStyles.gap) : 16;

    return slideWidth + gap;
  }

  scrollLeft() {
    const slideStep = this.getSlideStep();
    const slider = this.sliderRef.nativeElement;
    slider.scrollBy({
      left: -slideStep,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    const slideStep = this.getSlideStep();
    const slider = this.sliderRef.nativeElement;
    slider.scrollBy({
      left: slideStep,
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

    // Clear any previously scheduled scroll adjustment
    clearTimeout(this.scrollTimeout);

    // Delay the scroll adjustment until the user finishes scrolling
    this.scrollTimeout = setTimeout(() => {
      const slider = this.sliderRef.nativeElement;
      const slideStep = this.getSlideStep();
      const currentPosition = slider.scrollLeft;

      // Calcular a posição mais próxima do múltiplo do tamanho do slide
      const nearestSlidePosition = Math.round(currentPosition / slideStep) * slideStep;

      // Ajuste de scroll se necessário
      if (currentPosition !== nearestSlidePosition) {
        slider.scrollLeft = nearestSlidePosition;
      }
    }, 150); // Ajuste o tempo conforme necessário
  }

  ngAfterViewInit() {
    this.updateNavigationState();
  }
}
