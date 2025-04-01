import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AnimeService } from '../services/anime.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trending-bar',
  standalone:false,
  templateUrl: './trending-bar.component.html',
  styleUrl: './trending-bar.component.css'
})
export class TrendingBarComponent implements OnInit, AfterViewInit {
  
  @ViewChild('trendingList') trendingBar!: ElementRef;
  isAtStart = true;
  isAtEnd = false;
  trendingAnime: any[] = [];

  constructor(private router: Router, private animeService: AnimeService) {}

  ngOnInit(): void {
    this.fetchTrendingAnime();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.trendingBar) {
        this.checkScrollPosition();
      }
    }, 500);
  }

  fetchTrendingAnime(): void {
    this.animeService.getTrendingAnime().subscribe(
      (data) => {
        this.trendingAnime = data.slice(0, 10);
        setTimeout(() => this.checkScrollPosition(), 500);  // ✅ Ensure element exists before checking
      },
      (error) => {
        console.error("Error fetching trending anime:", error);
      }
    );
  }

  scrollLeft() {
    if (!this.trendingBar) return;
    const bar = this.trendingBar.nativeElement;
    bar.scrollBy({ left: -700, behavior: 'smooth' });
    setTimeout(() => this.checkScrollPosition(), 700);
  }

  scrollRight() {
    if (!this.trendingBar) return;
    const bar = this.trendingBar.nativeElement;
    bar.scrollBy({ left: 700, behavior: 'smooth' });
    setTimeout(() => this.checkScrollPosition(), 700);
  }

  checkScrollPosition() {
    if (!this.trendingBar) return;
    const bar = this.trendingBar.nativeElement;
    this.isAtStart = bar.scrollLeft === 0;
    this.isAtEnd = bar.scrollLeft + bar.clientWidth >= bar.scrollWidth;
  }

  goToDetail(animeId: string): void {
    this.router.navigate(['/anime-detail', animeId]);
  }
}
