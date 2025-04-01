// src/app/services/search.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient) {}

  searchAnime(query: string): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/anime/search?q=${query}`);
  }
}
