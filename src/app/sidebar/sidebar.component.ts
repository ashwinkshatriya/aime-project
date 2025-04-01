import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimeService } from '../services/anime.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  items: any[] = [];

  constructor(private animeService: AnimeService, private router: Router) {}

  ngOnInit() {
    this.fetchSidebarAnime();
  }

  fetchSidebarAnime() {
    this.animeService.getSidebarAnime().subscribe(
      (data) => {
  
        this.items = data.slice(0, 10).map((anime: any, index: number) => {
  
          // Check if episodes is an array and extract the first object
          const episodesObj = Array.isArray(anime.episodes) ? anime.episodes[0] : anime.episodes;
          const subCount = episodesObj?.sub ? episodesObj.sub.length : 0;
          const dubCount = episodesObj?.dub ? episodesObj.dub.length : 0;
          return {
            ...anime,
            rank: index + 1,
            badges: [
              { icon: 'fa-solid fa-closed-captioning', text: subCount, class: 'bg-light-green' },
              { icon: 'fa-solid fa-microphone', text: dubCount, class: 'bg-light-bluee' }
            ],
            highlight: index < 3
          };
        });
      },
      (error) => {
        console.error('Error fetching sidebar anime', error);
      }
    );
  }
  

  goToAnimeDetail(animeId: string) {
    this.router.navigate(['/anime-detail', animeId]); // ✅ Navigates to AnimeDetail page
  }

  getItemClass(item: any): string {
    return item._id <= 3 ? 'custom-background' : '';
  }
}
