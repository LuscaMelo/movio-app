import { Component, inject, computed, signal, effect } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FavoritesService, FavoriteItem } from '../../services/favorites.service';
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";
import { Breadcrumb } from '../../models/interfaces';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [BreadcrumbComponent, CommonModule, RouterLink, RouterModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent {
  private favoritesService = inject(FavoritesService);
  private router = inject(Router);

  title = 'Meus Favoritos';
  banner?: string | null;

  // Controle do modal
  selectedMovieId = signal<number | null>(null);
  isModalOpen = signal(false);

  breadcrumbsArray: Breadcrumb[] = [
    { label: 'Home', url: '/' },
    { label: 'Filmes', url: '/categorias' },
    { label: 'Favoritos', url: '/favoritos' }
  ];

  // Signal reativa do service
  favoritesSignal = toSignal<FavoriteItem[]>(this.favoritesService.favorites$, { requireSync: true });

  // Computed para template
  favoritesView = computed(() => {
    const favs = this.favoritesSignal() || [];
    return favs.map(f => ({
      id: f.id,
      title: (f as any).title || (f as any).name || 'Sem título',
      image: (f as any).image || 'https://via.placeholder.com/500x750?text=Sem+Imagem',
      vote_average: (f as any).imdb ?? null,
      overview: (f as any).overview ?? '',
    }));
  });

  constructor() {
    // Banner inicial
    const favs = this.favoritesService.getFavoritesSnapshot();
    if (favs.length > 0) {
      const first = favs[0];
      this.banner = 'image' in first && first.image ? first.image : null;
    }

    effect(() => {
      if (this.isModalOpen()) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  goToDetails(id: number) {
    this.router.navigate(['/filme', id]);
  }

  openConfirmModal(id: number) {
    this.selectedMovieId.set(id);
    this.isModalOpen.set(true);
  }

  cancelRemove() {
    this.isModalOpen.set(false);
    this.selectedMovieId.set(null);
  }

  confirmRemove() {
    const id = this.selectedMovieId();
    if (id !== null) {
      this.favoritesService.removeFavorite(id);
    }
    this.cancelRemove();
  }
}
