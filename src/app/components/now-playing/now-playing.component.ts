import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TmdbService, Movie } from '../../services/tmdb.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-now-playing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './now-playing.component.html',
  styleUrls: ['./now-playing.component.css']
})


export class NowPlayingComponent implements OnInit {
  movies: Movie[] = [];
  isLoading = true;
  skeletons = Array(5);

  @ViewChild('sliderRef') sliderRef!: ElementRef<HTMLDivElement>;

  private scrollTimeout: any;

  constructor(private tmdbService: TmdbService) {}

  ngOnInit() {
  this.tmdbService.getNowPlayingMovies().subscribe((res) => {
    this.movies = res.results;
    this.isLoading = false;
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
}
