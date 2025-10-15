import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Banner {
  title: string;
  year: number;
  imdb: number;
  duration: string;
  genre: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent {
  banners: Banner[] = [
    {
      title: 'The Flash',
      year: 2023,
      imdb: 8.2,
      duration: '1h 55min',
      genre: 'Fantasy | Actions',
      description: `Barry Allen, a forensic scientist with the Central City Police Department, 
      is struck by lightning during a particle accelerator explosion, gaining superhuman speed. 
      Now known as The Flash, Barry uses his newfound powers to protect his city from metahuman threats.`,
      image: '/the-flash-banner.jpg'
    },
    {
      title: 'The Flash 2',
      year: 2023,
      imdb: 8.2,
      duration: '1h 55min',
      genre: 'Fantasy | Actions',
      description: `Barry Allen, a forensic scientist with the Central City Police Department, 
      is struck by lightning during a particle accelerator explosion, gaining superhuman speed. 
      Now known as The Flash, Barry uses his newfound powers to protect his city from metahuman threats.`,
      image: '/the-flash-banner.jpg'
    },
    {
      title: 'The Flash 3',
      year: 2023,
      imdb: 8.2,
      duration: '1h 55min',
      genre: 'Fantasy | Actions',
      description: `Barry Allen, a forensic scientist with the Central City Police Department, 
      is struck by lightning during a particle accelerator explosion, gaining superhuman speed. 
      Now known as The Flash, Barry uses his newfound powers to protect his city from metahuman threats.`,
      image: '/the-flash-banner.jpg'
    },
  ];

  activeIndex = 0;

prevBanner() {
  this.activeIndex = (this.activeIndex - 1 + this.banners.length) % this.banners.length;
}

nextBanner() {
  this.activeIndex = (this.activeIndex + 1) % this.banners.length;
}

goToBanner(index: number) {
  this.activeIndex = index;
}
}
