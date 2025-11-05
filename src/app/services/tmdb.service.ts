import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// -------------------- Tipos auxiliares --------------------
export interface Genre {
  id: number;
  name: string;
  background?: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface CastMember {
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  name: string;
  job: string;
}

// -------------------- Movie principal --------------------
export interface Movie {
  id: number;
  title: string;
  original_title: string;
  original_language: string;
  overview: string;
  tagline?: string;
  homepage?: string;
  status?: string;
  runtime?: number;
  budget?: number;
  revenue?: number;
  release_date: string;
  popularity?: number;
  vote_average: number;
  vote_count?: number;
  adult?: boolean;
  video?: boolean;
  poster_path: string | null;
  backdrop_path: string | null;
  belongs_to_collection?: any;
  genres?: Genre[];
  genre_ids?: number[];
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  spoken_languages?: SpokenLanguage[];
}

// -------------------- Resposta padrão --------------------
export interface TMDBResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

// -------------------- Serviço --------------------
@Injectable({
  providedIn: 'root',
})
export class TmdbService {
  private readonly apiUrl = 'https://api.themoviedb.org/3';
  private readonly apiKey = 'd16dce72261954d4ecabe1fd6c94c34f';

  constructor(private http: HttpClient) {}

  // Filmes populares
  getPopularMovies(page: number = 1): Observable<TMDBResponse> {
    return this.fetchMovies(`${this.apiUrl}/movie/popular`, page);
  }

  // Filmes mais bem avaliados
  getTopRatedMovies(page: number = 1): Observable<TMDBResponse> {
    return this.fetchMovies(`${this.apiUrl}/movie/top_rated`, page);
  }

  // Filmes em cartaz
  getNowPlayingMovies(page: number = 1): Observable<TMDBResponse> {
    return this.fetchMovies(`${this.apiUrl}/movie/now_playing`, page);
  }

  // Próximos lançamentos
  getUpcomingMovies(page: number = 1): Observable<TMDBResponse> {
    return this.fetchMovies(`${this.apiUrl}/movie/upcoming`, page);
  }

  // Tendências da semana
  getTrendingMovies(page: number = 1): Observable<TMDBResponse> {
    return this.fetchMovies(`${this.apiUrl}/trending/movie/week`, page);
  }

  // Buscar filmes por nome
  searchMovies(query: string, page: number = 1): Observable<TMDBResponse> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'pt-BR')
      .set('query', query)
      .set('page', page);

    return this.http.get<TMDBResponse>(`${this.apiUrl}/search/movie`, { params });
  }

  // Pegar lista de gêneros
  getGenres(): Observable<Genre[]> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'pt-BR');

    return this.http
      .get<{ genres: Genre[] }>(`${this.apiUrl}/genre/movie/list`, { params })
      .pipe(map((res) => res.genres));
  }

  // Filmes por gênero (limite de 4)
  getMoviesByGenre4(genreId: number): Observable<Movie[]> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('with_genres', genreId)
      .set('language', 'pt-BR')
      .set('page', '1');

    return this.http
      .get<{ results: Movie[] }>(`${this.apiUrl}/discover/movie`, { params })
      .pipe(map((res) => res.results.slice(0, 4)));
  }

  // Filmes por gênero (completo)
  getMoviesByGenre(genreId: number): Observable<Movie[]> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('with_genres', genreId)
      .set('language', 'pt-BR')
      .set('page', '1');

    return this.http
      .get<{ results: Movie[] }>(`${this.apiUrl}/discover/movie`, { params })
      .pipe(map((res) => res.results));
  }

  // Detalhes do filme
  getMovieDetails(movieId: number): Observable<Movie> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'pt-BR');

    return this.http.get<Movie>(`${this.apiUrl}/movie/${movieId}`, { params });
  }

  // Trailer do filme
  getMovieVideos(movieId: number): Observable<any[]> {
  const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('language', 'pt-BR');

  return this.http
    .get<{ results: any[] }>(`${this.apiUrl}/movie/${movieId}/videos`, { params })
    .pipe(map(res => res.results));
}

  // Créditos (diretores, roteiristas e elenco)
  getMovieCredits(movieId: number): Observable<{ cast: CastMember[]; crew: CrewMember[] }> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'pt-BR');

    return this.http.get<{ cast: CastMember[]; crew: CrewMember[] }>(
      `${this.apiUrl}/movie/${movieId}/credits`,
      { params }
    );
  }

  getMovieRecommendations(id: number) {
    return this.http.get<any>(`${this.apiUrl}/movie/${id}/recommendations?api_key=${this.apiKey}&language=pt-BR`);
  }

  // Helper para evitar repetição
  private fetchMovies(endpoint: string, page: number): Observable<TMDBResponse> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('language', 'pt-BR')
      .set('page', page);

    return this.http.get<TMDBResponse>(endpoint, { params });
  }
}
