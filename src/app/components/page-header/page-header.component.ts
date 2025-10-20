import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {
  @Input() banner?: string | null;
  @Input() title?: string;

  imageLoading = false;
  dynamicTitle = ''; 

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    if (!this.title) {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.setTitleFromRoute();
      });
      this.setTitleFromRoute(); 
    } else {
      this.dynamicTitle = this.title;
    }
  }

  onImageLoad() {
    this.imageLoading = true;
  }

  private setTitleFromRoute() {
    // Rota atual
    const url = this.router.url;

    // Rota /categorias/:categoria
    const categoriaMatch = url.match(/^\/categorias\/([^\/]+)$/);
    if (categoriaMatch) {
      // Pode colocar o slug da categoria aqui ou formatar
      this.dynamicTitle = this.slugToTitle(categoriaMatch[1]);
      return;
    }

    // Rota /filme/:id (exemplo)
    if (url.startsWith('/filme/')) {
      this.dynamicTitle = 'Detalhes do filme';
      return;
    }

    // Rota /categorias ou outras
    if (url === '/categorias') {
      this.dynamicTitle = 'Categorias';
      return;
    }

    // Caso padrão
    this.dynamicTitle = 'Categorias';
  }

  private slugToTitle(slug: string): string {
    // converte slug de volta para título, ex: "acao-e-aventura" -> "Ação e Aventura"
    let words = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1));
    return words.join(' ');
  }
}
