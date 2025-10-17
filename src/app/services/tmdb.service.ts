import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Movie {
  id: number;
  backdrop_path: string | null;
  title: string;
  release_date: string;
  vote_average: number;
  overview: string;
  runtime?: number;
  genre_ids?: number[];
  poster_path: string;
  average: number
}

export interface Genre {
  id: number;
  name: string;
}

export interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private readonly apiUrl = 'https://api.themoviedb.org/3';
  private readonly apiKey = 'd16dce72261954d4ecabe1fd6c94c34f'; // API KEY

  constructor(private http: HttpClient) {}

  // Buscar filmes populares
  getPopularMovies(page: number = 1): Observable<TMDBResponse> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'pt-BR')
      .set('page', page);

    return this.http.get<TMDBResponse>(`${this.apiUrl}/movie/popular`, {
      params,
    });
  }

  // Buscar filmes mais bem avaliados
  getTopRatedMovies(page: number = 1): Observable<TMDBResponse> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'pt-BR')
      .set('page', page);

    return this.http.get<TMDBResponse>(`${this.apiUrl}/movie/top_rated`, {
      params,
    });
  }

  // Buscar filmes em cartaz
  getNowPlayingMovies(page: number = 1): Observable<TMDBResponse> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'pt-BR')
      .set('page', page);

    return this.http.get<TMDBResponse>(`${this.apiUrl}/movie/now_playing`, {
      params,
    });
  }

  // Buscar filmes com lançamento em breve
  getUpcomingMovies(page: number = 1): Observable<TMDBResponse> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'pt-BR')
      .set('page', page);

    return this.http.get<TMDBResponse>(`${this.apiUrl}/movie/upcoming`, {
      params,
    });
  }

  // Buscar filmes tendências da semana
  getTrendingMovies(page: number = 1): Observable<TMDBResponse> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'pt-BR')
      .set('page', page);

    return this.http.get<TMDBResponse>(`${this.apiUrl}/trending/movie/week`, {
      params,
    });
  }

  // Buscar detalhes de um filme específico
  getMovieDetails(movieId: number): Observable<Movie> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'pt-BR');

    return this.http.get<Movie>(`${this.apiUrl}/movie/${movieId}`, { params });
  }

  // Buscar filmes por nome
  searchMovies(query: string, page: number = 1): Observable<TMDBResponse> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'pt-BR')
      .set('query', query)
      .set('page', page);

    return this.http.get<TMDBResponse>(`${this.apiUrl}/search/movie`, {
      params,
    });
  }

  // Pegar lista de gêneros
  getGenres(): Observable<Genre[]> {
    return this.http.get<{ genres: Genre[] }>(`${this.apiUrl}/genre/movie/list?api_key=${this.apiKey}&language=en-US`)
      .pipe(map(res => res.genres));
  }

  // Pegar filmes por gênero
  getMoviesByGenre(genreId: number): Observable<Movie[]> {
    return this.http.get<{ results: Movie[] }>(`${this.apiUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}&language=en-US`)
      .pipe(map(res => res.results.slice(0, 4))); // pegar apenas 4 para mostrar no card
  }
}
