import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

@Component({
  selector: 'app-trailer-modal',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './trailer-modal.component.html',
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.97); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes fadeOut {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.97); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease forwards;
    }
    .animate-fadeOut {
      animation: fadeOut 0.25s ease forwards;
    }
  `],
})
export class TrailerModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() trailerUrl: string | null = null;
  @Output() close = new EventEmitter<void>();

  animatingIn = false;
  animatingOut = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible']) {
      if (this.visible) {
        this.startFadeIn();
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  startFadeIn() {
    this.animatingOut = false;
    this.animatingIn = true;
  }

  closeModal() {
    this.animatingIn = false;
    this.animatingOut = true;
    setTimeout(() => this.close.emit(), 250); // Espera animação de saída terminar
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
