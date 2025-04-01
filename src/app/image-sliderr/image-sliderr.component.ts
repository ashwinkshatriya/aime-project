import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimeService } from '../services/anime.service';

@Component({
  selector: 'app-image-sliderr',
  standalone:false,
  templateUrl: './image-sliderr.component.html',
  styleUrls: ['./image-sliderr.component.css']
})
export class ImageSliderrComponent implements OnInit {
  items: any[] = []; // Store fetched carousel animes
  currentIndex = 0;

  constructor(private animeService: AnimeService, private router: Router) {}

  ngOnInit(): void {
    this.loadCarouselAnimes();
  }

  loadCarouselAnimes() {
    this.animeService.getCarouselAnimes().subscribe(
      (data) => {
        console.log("🎞️ Carousel Anime Response:", data);
        if (Array.isArray(data) && data.length > 0) {
          this.items = data;
        } else {
          console.warn("⚠️ No carousel animes received.");
        }
      },
      (error) => {
        console.error("❌ Error fetching carousel animes:", error);
      }
    );
  }

  onPrev() {
  if (this.items.length > 0) {
    const prevIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    
    // Add transition delay
    document.querySelector('.carousel .list .item.active')?.classList.remove('active');
    setTimeout(() => {
      this.currentIndex = prevIndex;
    }, 300); // 300ms delay before changing the index
  }
}

onNext() {
  if (this.items.length > 0) {
    const nextIndex = (this.currentIndex + 1) % this.items.length;

    // Add transition delay
    document.querySelector('.carousel .list .item.active')?.classList.remove('active');
    setTimeout(() => {
      this.currentIndex = nextIndex;
    }, 300); // 300ms delay before changing the index
  }
}


  // Navigate to Anime Detail page using anime ID
  onWatchNow(animeId: string) {
    this.router.navigate([`/anime-detail/${animeId}`]);
  }
}
