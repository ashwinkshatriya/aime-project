import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { ImageSliderrComponent } from './image-sliderr/image-sliderr.component';
import { AnimeCardComponent } from './anime-card/anime-card.component';
import { AnimeDetailComponent } from './anime-detail/anime-detail.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TrendingBarComponent } from './trending-bar/trending-bar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AnimeListComponent } from './anime-list/anime-list.component';
import { RouterModule } from '@angular/router';
import { SharedService } from './services/shared.service';
import { FooterComponent } from './footer/footer.component';
@NgModule({
  declarations: [
    AppComponent,
    ImageSliderrComponent,
    AnimeCardComponent,
    AnimeDetailComponent,
    HomeComponent,
    TrendingBarComponent,
    SidebarComponent,
    NavBarComponent,
    AnimeListComponent,
    FooterComponent  
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    HttpClientModule, 
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'anime-list', component: AnimeListComponent },
      { path: 'anime-detail/:id', component: AnimeDetailComponent }
    ]),
    CommonModule
  ],
  providers: [
   SharedService, 
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
