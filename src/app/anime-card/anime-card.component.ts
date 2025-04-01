import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimeService } from '../services/anime.service';

@Component({
  selector: 'app-anime-card',
  standalone: false,
  templateUrl: './anime-card.component.html',
  styleUrl: './anime-card.component.css'
})
export class AnimeCardComponent implements OnInit {
  animeList: any[] = [];
  pagedAnimeList: any[] = [];
  currentPage: number = 0;
  pageSize: number = 18; // Default page size

  constructor(private animeService: AnimeService, private router: Router) {}

  ngOnInit(): void {
    this.adjustPageSize(); // Adjust page size based on screen width
    this.loadAnime();
  }

  // ✅ Adjust page size dynamically based on screen width
  @HostListener('window:resize', [])
  onResize(): void {
    this.adjustPageSize();
    this.updatePagedAnimeList();
  }

  adjustPageSize(): void {
    const width = window.innerWidth;

    if (width <= 480) 
    {
      this.pageSize = 10;  // Show 9 anime per page on small screens
    } 
    else if (width <= 768) 
    {
      this.pageSize = 12; // Show 12 anime per page on tablets
    } 
    else if (width <= 1024) 
    {
      this.pageSize = 12; // Show 15 anime per page on smaller desktops/laptops
    }else if (width <= 1199){
      this.pageSize = 12;
    }
     else 
     {
      this.pageSize = 18; // Default size for larger screens
    }
  }

  // ✅ Fetch anime list from service
  loadAnime(): void {
    this.animeService.getAnimeList([], [], {}).subscribe(
      (data) => {
        console.log("Fetched Anime List:", data);
        if (Array.isArray(data) && data.length > 0) {
          this.animeList = data;
          this.updatePagedAnimeList();
        } else {
          console.warn("Received empty or invalid anime list.");
        }
      },
      (error) => console.error("Error fetching anime list:", error)
    );
  }

  // ✅ Update displayed anime based on pagination
  updatePagedAnimeList(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.pagedAnimeList = this.animeList.slice(start, end);
  }

  // ✅ Previous page logic
  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePagedAnimeList();
    }
  }

  // ✅ Next page logic
  nextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.animeList.length) {
      this.currentPage++;
      this.updatePagedAnimeList();
    }
  }

  // ✅ Get subbed episodes count
  getSubbedEpisodesCount(anime: any): number {
    return anime.subEpisodes ?? 0; // Use direct property from API response
  }

  // ✅ Get dubbed episodes count
  getDubbedEpisodesCount(anime: any): number {
    return anime.dubEpisodes ?? 0; // Use direct property from API response
  }

  // ✅ Open anime detail page in the same tab unless Ctrl/Command is pressed
  openInSameTab(event: MouseEvent, id: string): void {
    if (event.ctrlKey || event.metaKey || event.button === 1) {
      return; // Allow new tab behavior
    }
    
    event.preventDefault(); // Prevent default new tab behavior
    this.router.navigate(['/anime-detail', id]); // Open in the same tab
  }
}
