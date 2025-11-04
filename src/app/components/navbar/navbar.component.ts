import { Component, computed, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { TmdbService } from '../../services/tmdb.service';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  menuOpen = false;
  scrolled = false;
  showSearch = false;
  searchQuery = '';
  searchResults: any[] = [];
  isSearching = false;
  private favoritesService = inject(FavoritesService);

  // Signal reativo do service
  favoritesSignal = toSignal(this.favoritesService.favorites$, { initialValue: [] });

  // Contagem de favoritos
  favoritesCount = computed(() => this.favoritesSignal().length);

  constructor(private tmdbService: TmdbService, private router: Router) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      this.showSearch = false;
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      this.menuOpen = false;
      this.scrolled = true; 
    } else {
      this.scrolled = window.scrollY > 50;  
    }
  }

  ngOnInit() {
    this.onScroll();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.scrolled = window.scrollY > 50;
  }

  // 🔍 Buscar filmes pelo nome digitado
  searchMovies() {
  const query = this.searchQuery.trim();
  if (!query) return;

  this.router.navigate(['/buscar'], { queryParams: { q: query } });
  this.searchQuery = '';
  this.showSearch = false;
}

  // Disparar busca ao pressionar Enter
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.searchMovies();
    }
  }
}
