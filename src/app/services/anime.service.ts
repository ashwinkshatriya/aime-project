import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  private apiUrl = 'http://localhost:3000/api/anime';

  constructor(private http: HttpClient) { }

  // ✅ Fetch all anime
  // ✅ Fetch anime list with optional filters
  getAnimeList(
    selectedGenres: string[],
    selectedTypes: string[],
    filters?: {
      genre?: string;
      type?: string;
      sort?: string;
      status?: string;
      isAdult?: boolean | null  // Allow isAdult to be null
    }): Observable<any[]> {
    let params: any = {};

    if (filters?.genre) params.genre = filters.genre;
    if (filters?.type) params.type = filters.type;
    if (filters?.sort) params.sort = filters.sort;
    if (filters?.status) params.status = filters.status;
    if (filters?.isAdult !== undefined) params.isAdult = filters.isAdult;  // Keep the filter

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  getCarouselAnimes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/carousel`);
  }
  
  
  
  // ✅ Fetch anime by ID
  getAnimeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getSidebarAnime(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sidebar-anime`);
  }


  // ✅ Fetch trending anime
  getTrendingAnime(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/trending`);
  }

  // ✅ Mark an anime as trending
  updateTrendingStatus(animeId: string, isTrending: boolean): Observable<any> {
    return this.http.put(`${this.apiUrl}/trending/${animeId}`, { isTrending });
  }
}
