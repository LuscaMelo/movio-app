import { Component, ElementRef, Input, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cast-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cast-slider.component.html',
  styleUrls: ['./cast-slider.component.css']
})
export class CastSliderComponent implements AfterViewInit {
  @Input() cast: any[] = [];
  @Input() title = 'Elenco principal';
  @Input() isLoading = false;

  @ViewChild('sliderRef') sliderRef!: ElementRef<HTMLDivElement>;

  skeletons = Array(6);
  private scrollTimeout: any;
  isAtStart = true;
  isAtEnd = false;

  ngAfterViewInit() {
    setTimeout(() => this.updateNavigationState(), 100);
  }

  scrollLeft() {
    const step = this.getSlideStep();
    const slider = this.sliderRef.nativeElement;
    slider.scrollBy({ left: -step, behavior: 'smooth' });
  }

  scrollRight() {
    const step = this.getSlideStep();
    const slider = this.sliderRef.nativeElement;
    slider.scrollBy({ left: step, behavior: 'smooth' });
  }

  onScroll() {
    this.updateNavigationState();

    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      const slider = this.sliderRef.nativeElement;
      const step = this.getSlideStep();
      const maxScroll = slider.scrollWidth - slider.clientWidth;

      // Calcula o ponto mais próximo (snap)
      let nearest = Math.round(slider.scrollLeft / step) * step;

      // Garante que não ultrapasse o limite
      if (nearest > maxScroll - step / 2) {
        nearest = maxScroll;
      } else if (nearest < 0) {
        nearest = 0;
      }

      slider.scrollTo({ left: nearest, behavior: 'smooth' });
    }, 150);
  }

  private getSlideStep(): number {
    const slider = this.sliderRef.nativeElement;
    const slide = slider.querySelector('div');
    if (!slide) return 220;
    const slideWidth = slide.getBoundingClientRect().width;
    const sliderStyles = window.getComputedStyle(slider);
    const gap = parseFloat(sliderStyles.columnGap || sliderStyles.gap || '16');
    return slideWidth + gap;
  }

  private updateNavigationState() {
    const slider = this.sliderRef.nativeElement;
    this.isAtStart = slider.scrollLeft === 0;
    this.isAtEnd = Math.ceil(slider.scrollLeft + slider.clientWidth) >= slider.scrollWidth;
  }
}
