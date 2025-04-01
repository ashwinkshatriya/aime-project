import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private selectedGenre = new BehaviorSubject<string []| null>(null);
  selectedGenre$ = this.selectedGenre.asObservable();

  private selectedType = new BehaviorSubject<string []| null>(null);
  selectedType$ = this.selectedType.asObservable();

  private selectedCategory = new BehaviorSubject<string | null>(null);
  selectedCategory$ = this.selectedCategory.asObservable();

  private selectedStatus = new BehaviorSubject<string[] | null>(null); 
selectedStatus$ = this.selectedStatus.asObservable();

private selectedIsAdult = new BehaviorSubject<boolean | null>(null);  // Added for isAdult
  selectedIsAdult$ = this.selectedIsAdult.asObservable();

  setGenre(genre: string[]) {
    this.selectedGenre.next(genre);
  }

  setStatus(status: string[]) {  
    this.selectedStatus.next(status);
}

  setType(type: string[]) {
    this.selectedType.next(type);
  }

  setCategory(category: string) {
    this.selectedCategory.next(category);
  }

  setIsAdult(isAdult: boolean | null) {  // New method to set isAdult
    this.selectedIsAdult.next(isAdult);
  }
}
