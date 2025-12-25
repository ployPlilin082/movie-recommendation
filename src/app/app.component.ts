import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import { NavbarComponent } from './pages/navbar/navbar.component';
import { FooterComponent } from './pages/footer/footer.component';
import { CarouselComponent } from './component/carousel/carousel.component';
import { HeroSliderComponent } from './component/hero-slider/hero-slider.component';  

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent,NavbarComponent,FooterComponent, CarouselComponent, HeroSliderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-angular-app';
}
