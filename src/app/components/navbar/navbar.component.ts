import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  menuOpen = false;
  scrolled = false;

  scrollToSection(id: string) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  this.menuOpen = false;
  document.body.classList.remove('no-scroll');
}

  toggleMenu() {
  this.menuOpen = !this.menuOpen;

  if (this.menuOpen) {
    document.body.classList.add('no-scroll');
  } else {
    document.body.classList.remove('no-scroll');
  }
}

  ngOnInit() {
    this.onScroll();
  }

  // Escuta o evento de scroll da janela
  @HostListener('window:scroll', [])
  onScroll(): void {
    this.scrolled = window.scrollY > 50;
  }
}
