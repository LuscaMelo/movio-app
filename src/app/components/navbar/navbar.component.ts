import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  menuOpen = false;
  scrolled = false;
  showSearch = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      this.showSearch = false;
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      this.menuOpen = false;
      this.scrolled = true; 
    } else {
      this.scrolled = window.scrollY > 50;  
    }
  }

  ngOnInit() {
    this.onScroll();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.scrolled = window.scrollY > 50;
  }
}
