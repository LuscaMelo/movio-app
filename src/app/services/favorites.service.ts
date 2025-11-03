import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from './tmdb.service';

export interface Banner {
  id: number;
  image: string;
  title: string;
  year: string;
  imdb: number;
  description: string;
  duration?: string;
  genre?: string;
}

/** Tipo unificado para Movie e Banner */
export type FavoriteItem = Movie | Banner;

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private storageKey = 'favorite_movies';
  private favoritesSubject: BehaviorSubject<FavoriteItem[]>;

  constructor() {
    // Inicializa o BehaviorSubject com dados do localStorage
    const initial = this.readFromStorage();
    this.favoritesSubject = new BehaviorSubject<FavoriteItem[]>(initial);
  }

  /** Observable público para components assinarem */
  get favorites$(): Observable<FavoriteItem[]> {
    return this.favoritesSubject.asObservable();
  }

  /** Snapshot síncrono da lista atual */
  getFavoritesSnapshot(): FavoriteItem[] {
    return this.favoritesSubject.getValue();
  }

  /** Retorna true/false se o item está entre os favoritos */
  isFavorite(id: number): boolean {
    return this.getFavoritesSnapshot().some(m => m.id === id);
  }

  /** Observable que emite true/false se o item está nos favoritos */
  isFavorite$(id: number): Observable<boolean> {
    return this.favorites$.pipe(map(list => list.some(m => m.id === id)));
  }

  /** Adiciona um item aos favoritos */
  addFavorite(item: FavoriteItem): void {
  const current = this.getFavoritesSnapshot();

  // Normaliza Movie para ter image e imdb
  const favoriteItem: FavoriteItem = 'poster_path' in item
    ? {
        ...item,
        image: item.poster_path ? 'https://image.tmdb.org/t/p/w500' + item.poster_path : '',
        imdb: item.vote_average,
        overview: item.overview || '',
      }
    : item;

  if (!current.some(m => m.id === favoriteItem.id)) {
    const next = [...current, favoriteItem];
    this.updateState(next);
  }
}

  /** Remove um item dos favoritos pelo id */
  removeFavorite(id: number): void {
    const next = this.getFavoritesSnapshot().filter(m => m.id !== id);
    this.updateState(next);
  }

  /** Alterna: adiciona ou remove dependendo do estado atual */
  toggleFavorite(item: FavoriteItem): void {
    if (this.isFavorite(item.id)) {
      this.removeFavorite(item.id);
    } else {
      this.addFavorite(item);
    }
  }

  /** Substitui toda a lista de favoritos */
  setFavorites(list: FavoriteItem[]): void {
    this.updateState([...list]);
  }

  /** Limpa todos os favoritos */
  clearFavorites(): void {
    this.updateState([]);
  }

  /** --------- Helpers privados --------- */

  /** Lê os favoritos do localStorage */
  private readFromStorage(): FavoriteItem[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Falha ao ler favoritos do localStorage', e);
      return [];
    }
  }

  /** Salva os favoritos no localStorage */
  private saveToStorage(list: FavoriteItem[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(list));
    } catch (e) {
      console.error('Falha ao salvar favoritos no localStorage', e);
    }
  }

  /** Atualiza o BehaviorSubject e o storage */
  private updateState(next: FavoriteItem[]): void {
    this.favoritesSubject.next(next);
    this.saveToStorage(next);
  }
}
