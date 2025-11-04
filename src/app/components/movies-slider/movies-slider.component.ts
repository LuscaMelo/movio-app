import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../services/tmdb.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-movie-slider',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movies-slider.component.html',
  styleUrls: ['./movies-slider.component.css']
})
export class MoviesSliderComponent implements OnInit, AfterViewInit {
  @Input() movies: Movie[] = [];
  @Input() isLoading = true;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() link = '';

  @ViewChild('sliderRef') sliderRef!: ElementRef<HTMLDivElement>;

  constructor(private router: Router) {}

  skeletons = Array(6);
  private scrollTimeout: any;

  isAtStart = true;
  isAtEnd = false;

  activeMovieId: number | null = null;

setActiveMovie(id: number) {
  this.activeMovieId = id;
}

clearActiveMovie() {
  this.activeMovieId = null;
}

  ngOnInit() {}

  ngAfterViewInit() {
  setTimeout(() => {
    this.updateNavigationState();
  }, 100);
}

  scrollLeft() {
    const slideStep = this.getSlideStep();
    const slider = this.sliderRef.nativeElement;

    if (slider.scrollLeft <= slideStep) {
      slider.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      slider.scrollBy({ left: -slideStep, behavior: 'smooth' });
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
      slider.scrollBy({ left: slideStep, behavior: 'smooth' });
    }
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

  onScroll() {
    this.updateNavigationState();

    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      const slider = this.sliderRef.nativeElement;
      const slideStep = this.getSlideStep();
      const currentPosition = slider.scrollLeft;
      const maxScroll = slider.scrollWidth - slider.clientWidth;

      if (currentPosition + slideStep < maxScroll) {
        const nearestSlidePosition = Math.round(currentPosition / slideStep) * slideStep;
        if (currentPosition !== nearestSlidePosition) {
          slider.scrollLeft = nearestSlidePosition;
        }
      }
    }, 150);
  }

  private updateNavigationState() {
    if (!this.sliderRef?.nativeElement) return;

    const slider = this.sliderRef.nativeElement;
    this.isAtStart = slider.scrollLeft === 0;
    this.isAtEnd = Math.ceil(slider.scrollLeft + slider.clientWidth) >= slider.scrollWidth;
  }

  goToDetails(id: number) {
    this.router.navigate(['/filme', id]);
  }
}
