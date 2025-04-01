import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnimeService } from '../services/anime.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

interface Episode {
  episodeNumber: number;
  videoPath: string;
}

interface Anime {
  id: string;
  title: string;
  description: string;
  image: string;
  genres: string[];
  country: string;
  premiered: string;
  videoPath: string;
  totalEpisodes: number;
  episodes: {
    sub?: Episode[];
    dub?: Episode[];
  };
  isAdult: boolean;
  DateAired: string;
  broadcast: string;
  duration: string;
  producers: string;
  status: string;
  studio: string;
  malRating?: number;
}

@Component({
  selector: 'app-anime-detail',
  standalone: false,
  templateUrl: './anime-detail.component.html',
  styleUrls: ['./anime-detail.component.css']
})
export class AnimeDetailComponent implements OnInit {
  anime: Anime | null = null;
  currentVideoUrl: SafeResourceUrl = ''; // Use SafeResourceUrl for security
  currentEpisodeNumber: number | null = null;
  isExpanded = false;

  constructor(
    private route: ActivatedRoute,
    private animeService: AnimeService,
    private sanitizer: DomSanitizer // Inject DomSanitizer
  ) {}

  ngOnInit(): void {
    const animeId = this.route.snapshot.paramMap.get('id');

    if (animeId) {
      this.animeService.getAnimeById(animeId).subscribe(
        (data: Anime) => {
          this.anime = data;

          // ✅ Set the first episode as the default
          const firstSubEpisode = data.episodes?.sub?.[0];
          if (firstSubEpisode) {
            this.selectEpisode(firstSubEpisode.episodeNumber);
          }
        },
        (error) => console.error("❌ Error fetching anime details:", error)
      );
    }
  }

  toggleDescription(): void {
    this.isExpanded = !this.isExpanded;
  }

  // ✅ Correct way to sanitize URLs before using them in an iframe
  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  selectEpisode(episodeNumber: number): void {
    this.currentEpisodeNumber = episodeNumber;

    const subEpisode = this.anime?.episodes?.sub?.find((ep) => ep.episodeNumber === episodeNumber);
    if (subEpisode) {
      this.currentVideoUrl = this.getSafeUrl(subEpisode.videoPath);
    }
  }

  playSub(): void {
    if (!this.currentEpisodeNumber) return;
    
    const subEpisode = this.anime?.episodes?.sub?.find((ep) => ep.episodeNumber === this.currentEpisodeNumber);
    if (subEpisode) {
      this.currentVideoUrl = this.getSafeUrl(subEpisode.videoPath);
    }
  }

  playDub(): void {
    if (!this.currentEpisodeNumber) return;

    const dubEpisode = this.anime?.episodes?.dub?.find((ep) => ep.episodeNumber === this.currentEpisodeNumber);
    if (dubEpisode) {
      this.currentVideoUrl = this.getSafeUrl(dubEpisode.videoPath);
    }
  }

  hasDub(episodeNumber: number): boolean {
    return this.anime?.episodes?.dub?.some((ep) => ep.episodeNumber === episodeNumber) || false;
  }

  hasSub(episodeNumber: number): boolean {
    return this.anime?.episodes?.sub?.some((ep) => ep.episodeNumber === episodeNumber) || false;
  }
}
