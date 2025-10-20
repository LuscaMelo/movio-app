import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TmdbService, Movie } from '../../services/tmdb.service';
import { forkJoin } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

interface GenreWithMovies {
  id: number;
  name: string;
  movies: Movie[];
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [ RouterModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  genres: GenreWithMovies[] = [];
  isLoading = true;
  skeletons = Array(5);

  @ViewChild('sliderRef') sliderRef!: ElementRef<HTMLDivElement>;

  private scrollTimeout: any;

  constructor(private tmdbService: TmdbService, private router: Router) {}

  ngOnInit() {
    this.tmdbService.getGenres().subscribe(genres => {
      const requests = genres.map(genre => this.tmdbService.getMoviesByGenre4(genre.id));

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

  const slideWidth = slide.getBoundingClientRect().width;
  const sliderStyles = window.getComputedStyle(slider);
  const gap = parseFloat(sliderStyles.columnGap || sliderStyles.gap || '16');

  return slideWidth + gap;
}

  scrollLeft() {
  const slideStep = this.getSlideStep();
  const slider = this.sliderRef.nativeElement;

  if (slider.scrollLeft <= slideStep) {
    slider.scrollTo({
      left: 0,
      behavior: 'smooth'
    });
  } else {
    slider.scrollBy({
      left: -slideStep,
      behavior: 'smooth'
    });
  }
}


  scrollRight() {
  const slideStep = this.getSlideStep();
  const slider = this.sliderRef.nativeElement;

  const remainingScroll = slider.scrollWidth - slider.clientWidth - slider.scrollLeft;

  if (remainingScroll <= slideStep) {
    slider.scrollTo({
      left: slider.scrollWidth - slider.clientWidth,
      behavior: 'smooth'
    });
  } else {
    slider.scrollBy({
      left: slideStep,
      behavior: 'smooth'
    });
  }
}

  isAtStart = true;
  isAtEnd = false;

  private updateNavigationState() {
    if (!this.sliderRef?.nativeElement) return;

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

  const maxScroll = slider.scrollWidth - slider.clientWidth;

  // Só aplica se ainda não estiver no final
  if (currentPosition + slideStep < maxScroll) {
    const nearestSlidePosition = Math.round(currentPosition / slideStep) * slideStep;

    if (currentPosition !== nearestSlidePosition) {
      slider.scrollLeft = nearestSlidePosition;
    }
  }
}, 150);
  }

  ngAfterViewInit() {
    this.updateNavigationState();
  }

  goToCategory(genre: GenreWithMovies) {
    const genreSlug = this.slugify(genre.name);
    this.router.navigate(['/categorias', genreSlug]);
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD') // remove accents
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')             // spaces to -
      .replace(/[^\w\-]+/g, '')         // remove non-word characters
      .replace(/\-\-+/g, '-')           // collapse multiple -
      .replace(/^-+|-+$/g, '');         // trim - from start/end
  }
}
