import { Component, HostListener, OnInit } from '@angular/core';
import { AnimeService } from '../services/anime.service';
import { SharedService } from '../services/shared.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-anime-list',
  standalone: false,
  templateUrl: './anime-list.component.html',
  styleUrls: ['./anime-list.component.css']
})
export class AnimeListComponent implements OnInit {
  animes: any[] = [];
  selectedGenres: string[] = [];
  selectedTypes: string[] = [];
  selectedStatus: string[] = [];
  selectedIsAdult: boolean | null = null;  // Added isAdult filter
  selectedCategory: string = '';
  selectedSort: string = '';
  openDropdown: string | null = null;

  // ✅ Genre List
  genres: string[] = [
    "Action", "Adventure", "Avant Garde", "Boys Love", "Comedy", "Demons",
    "Drama", "Ecchi", "Fantasy", "Girls Love", "Gourmet", "Harem",
    "Horror", "Isekai", "Iyashikei", "Josei", "Kids", "Magic",
    "Mahou Shoujo", "Martial Arts", "Mecha", "Military", "Music",
    "Mystery", "Parody", "Psychological", "Reverse Harem",
    "Romance", "School", "Sci-Fi", "Seinen", "Shoujo", "Shounen",
    "Slice of Life", "Space", "Sports", "Super Power", "Supernatural",
    "Suspense", "Thriller", "Vampire"
  ];

  // ✅ Type List
  types: string[] = ["MOVIE", "TV Series", "OVA", "ONA", "SPECIAL"];

  // ✅ Status List
  statuses: string[] = ["Ongoing", "Completed", "Upcoming"];

  constructor(
    private animeService: AnimeService,
    private sharedService: SharedService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Subscribe to shared services for genre, type, category, and sort
    this.sharedService.selectedGenre$.subscribe((genre: string[] | null) => {
      if (genre) {
        this.selectedGenres = genre ?? [];
      }
    });

    this.sharedService.selectedType$.subscribe((type: string[] | null) => {
      this.selectedTypes = type ?? [];
    });

    this.sharedService.selectedStatus$.subscribe((status: string[] | null) => {
      this.selectedStatus = status ?? [];
    });

    this.sharedService.selectedCategory$.subscribe((category: string | null) => {
      if (category) {
        this.selectedCategory = category;
      }
    });

    this.sharedService.selectedIsAdult$.subscribe((isAdult: boolean | null) => {
      this.selectedIsAdult = isAdult; // Set isAdult from shared service
    });

    // Retrieve queryParams on init and apply filters
    this.route.queryParams.subscribe((params) => {
      const sort = params['sort'] || '';  // Default sort if not passed
      const category = params['category'] || '';  // Default category if not passed
      const genre = params['genre'] || '';  // Default genre if not passed
      const type = params['type'] || '';  // Default type if not passed

      // Set the values to the component properties
      if (genre) this.selectedGenres = [genre];
      if (type) this.selectedTypes = [type];
      if (category) this.selectedCategory = category;
      if (sort) this.selectedSort = sort;

      // Apply filters
      this.applyFilters();
    });
  }

  ngOnDestroy() {
    this.sharedService.setType([]); // Clear selected type
    this.sharedService.setGenre([]); // Clear selected genres
    this.sharedService.setStatus([]); // Clear selected statuses
  }

  // This method will be called when the user clicks the 'Filter' button
  applyFilters() {
    const normalizedTypes = this.selectedTypes.map(type => type === 'TV' ? 'TV Series' : type);

    const filters = {
      genre: this.selectedGenres.length > 0 ? this.selectedGenres.join(',') : undefined,
      type: normalizedTypes.length > 0 ? normalizedTypes.join(',') : undefined,
      status: this.selectedStatus.length > 0 ? this.selectedStatus.join(',') : undefined,  // Add status filter
      sort: this.selectedSort || undefined,
      isAdult: this.selectedIsAdult  // Pass isAdult to the backend
    };

    this.animeService.getAnimeList(this.selectedGenres, normalizedTypes, filters).subscribe((data: any) => {
      console.log('Fetched anime data:', data);
      this.animes = data;
    });
}


  // Method to toggle the isAdult filter
  toggleIsAdult() {
    this.selectedIsAdult = this.selectedIsAdult === null ? true : !this.selectedIsAdult;
    this.sharedService.setIsAdult(this.selectedIsAdult);  // Update SharedService
    this.applyFilters();  // Reapply filters with the new isAdult value
  }

  // Methods for toggling the selections without applying filters yet
  toggleGenre(genre: string) {
    if (this.selectedGenres.includes(genre)) {
      this.selectedGenres = this.selectedGenres.filter(g => g !== genre);
    } else {
      this.selectedGenres.push(genre);
    }
  }

  toggleType(type: string) {
    const backendType = type === 'TV Series' ? 'TV Series' : type; // Use 'TV Series' directly for consistency
  
    if (this.selectedTypes.includes(backendType)) {
      this.selectedTypes = this.selectedTypes.filter(t => t !== backendType);
    } else {
      this.selectedTypes.push(backendType);
    }
  
    // Send the selected types to the backend (no need to convert here since it's already in the correct format)
    this.sharedService.setType(this.selectedTypes);
  }
  

  setSort(sort: string) {
    this.selectedSort = sort;  // Store the selected sort option
    this.fetchSortedAnime();    // Fetch sorted anime based on the selected sort option
  }

  fetchSortedAnime() {
    const filters = { sort: this.selectedSort };  // Pass the sort filter to the service
    this.animeService.getAnimeList(this.selectedGenres, this.selectedTypes, filters).subscribe(
      (animeList) => {
        this.animes = animeList;
      },
      (error) => {
        console.error("Error fetching sorted anime:", error);
      }
    );
  }

  setStatus(status: string) {
    let updatedStatus = [...this.selectedStatus];

    if (updatedStatus.includes(status)) {
      updatedStatus = updatedStatus.filter(s => s !== status);
    } else {
      updatedStatus.push(status);
    }

    this.selectedStatus = updatedStatus;
    this.sharedService.setStatus(updatedStatus); // ✅ Updates SharedService
  }

  // Dropdown handling
  toggleDropdown(dropdown: string): void {
    this.openDropdown = this.openDropdown === dropdown ? null : dropdown;
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOnOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.openDropdown = null;
    }
  }

  getLabel(type: string): string {
    let selectedArray;

    // Determine which array to check based on the dropdown type
    switch (type) {
      case 'genre':
        selectedArray = this.selectedGenres;
        break;
      case 'status':
        selectedArray = this.selectedStatus;
        break;
      case 'type':
        selectedArray = this.selectedTypes.filter(t => t === 'TV Series' ? 'TV Series' : t);
        break;
      case 'sort':
        // Special handling for sort, as it's a single value, not an array
        if (this.selectedSort === 'updatedAt') {
          return 'Recently Updated';
        } else if (this.selectedSort === 'rating') {
          return 'MAL Score';
        } else if (this.selectedSort === 'release') {
          return 'Release Date';
        } else if (this.selectedSort === 'mostWatched') {
          return 'Most Watched';
        } else {
          return 'Sort By'; // Default label if nothing is selected
        }
      default:
        return 'Unknown';
    }

    // Check the selected array for genre, status, or type
    if (selectedArray.length === 0) {
      return type.charAt(0).toUpperCase() + type.slice(1);  // Capitalize the type (e.g. 'Genre')
    } else if (selectedArray.length === 1) {
      return selectedArray[0];  // Return the single selected option without appending "+x"
    } else {
      return `${selectedArray[0]} +${selectedArray.length - 1}`;  // First selected option + number of additional selected options
    }
  }
}
