import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { SearchService } from '../services/search.service';
import { debounceTime,switchMap } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  searchQuery: string = ''; // To hold the input value
  searchResults: any[] = []; // To hold the search results
  isGenresOpen = false;
  isTypesOpen = false;

  genres = [
    "Action", "Adventure", "Avant Garde", "Boys Love", "Comedy", "Demons",
    "Drama", "Ecchi", "Fantasy", "Girls Love", "Gourmet", "Harem",
    "Horror", "Isekai", "Iyashikei", "Josei", "Kids", "Magic",
    "Mahou Shoujo", "Martial Arts", "Mecha", "Military", "Music",
    "Mystery", "Parody", "Psychological", "Reverse Harem",
    "Romance", "School", "Sci-Fi", "Seinen", "Shoujo", "Shounen",
    "Slice of Life", "Space", "Sports", "Super Power", "Supernatural",
    "Suspense", "Thriller", "Vampire"
  ];

  types = ["Movies", "TV Series", "OVAs", "ONAs", "Specials"];

  constructor(private eRef: ElementRef, private router: Router, private sharedService: SharedService,private searchService: SearchService) {}

  onSearchQueryChange(query: string) {
    if (query.length >= 2) {
      this.searchService.searchAnime(query).subscribe((results) => {
        this.searchResults = results;
      });
    } else {
      this.searchResults = [];
    }
  }

goToAnimeDetail(id: string) {
    this.router.navigate(['/anime-detail', id]);
}


  toggleGenres() {
    this.isGenresOpen = !this.isGenresOpen;
    this.isTypesOpen = false; // Close types when genres is opened
  }

  toggleTypes() {
    this.isTypesOpen = !this.isTypesOpen;
    this.isGenresOpen = false; // Close genres when types is opened
  }

  // ✅ Send selected genre to SharedService
  sortByGenre(genre: string) {
    console.log("Sorted by Genre:", genre);
    this.sharedService.setGenre([genre]);
    this.isGenresOpen = false;
    this.router.navigate(['/anime-list']); // Navigate to anime list
  }

  // ✅ Send selected type to SharedService
  sortByType(type: string) {
    console.log("Selected Type:", type);
    this.sharedService.setType([type]);
    this.isTypesOpen = false;
    this.router.navigate(['/anime-list']); // Navigate to anime list
  }

  sortByCategory(category: string) {
    console.log("Sorted by Category:", category);
    this.sharedService.setCategory(category);  // Update the shared service with the category
  
    // Set the status based on the category
    if (category === 'ongoing') {
      this.sharedService.setStatus(['Ongoing']);
    } else {
      this.sharedService.setStatus([]);
    }
  
    this.router.navigate(['/anime-list'], { queryParams: { sort: 'updatedAt', category } }); // Pass default sort and category in queryParams
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (event.target && !this.eRef.nativeElement.contains(event.target)) {
      this.isGenresOpen = false;
      this.isTypesOpen = false;
    }
  }

  subscribeAndRedirect() {
    // Navigate to the anime-list page with the default sort (recently updated)
    this.router.navigate(['/anime-list'], { queryParams: { sort: 'updatedAt' } });
  }
}