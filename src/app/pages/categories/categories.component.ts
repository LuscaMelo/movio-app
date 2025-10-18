import { Component } from '@angular/core';
import { PageHeaderComponent } from "../../components/page-header/page-header.component";
import { TmdbService } from '../../services/tmdb.service';
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [PageHeaderComponent, BreadcrumbComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {

  constructor(private tmdbService: TmdbService) {}
  
  banner?: String | null
  number = Math.floor(Math.random() * 20);

ngOnInit() {
    this.tmdbService.getPopularMovies().subscribe(res => {
      this.banner = res.results[this.number].backdrop_path;
    });
  }
}
