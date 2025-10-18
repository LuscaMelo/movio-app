import { Component, signal } from '@angular/core';
import { Router, NavigationEnd, RouterModule, ActivatedRouteSnapshot } from '@angular/router';
import { filter } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav aria-label="breadcrumb" class="max-w-[1500px] mx-auto px-3 py-5 bg-gradient-to-r from-dark via-zinc-900 to-dark">
      <ol class="flex flex-wrap items-center space-x-1">
        @for (crumb of breadcrumbs(); track crumb.url; let last = $last) {
          <li class="flex items-center">
            @if (!last) {
              <a [routerLink]="crumb.url" class="text-white hover:underline underline-offset-4 duration-300 hover:text-brand">
                {{ crumb.label }}
              </a>
              <span class="ml-2 mx-1 text-gray-500">/</span>
            } @else {
              <span class="font-semibold text-gray-500">{{ crumb.label }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `
})
export class BreadcrumbComponent {
  breadcrumbs = signal<Breadcrumb[]>([]);

  constructor(private router: Router) {
    this.router.events.pipe(
  filter(event => event instanceof NavigationEnd)
).subscribe(() => {
  const root = this.router.routerState.snapshot.root;
  const crumbs = [{ label: 'Início', url: '/' }]; 
  this.buildBreadcrumbs(root, '', crumbs);
  this.breadcrumbs.set(crumbs);
});
  }

  private buildBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL = child.url.map(segment => segment.path).join('/');
      const nextUrl = url ? this.joinUrls(url, routeURL) : (routeURL ? '/' + routeURL : '/');

      if (child.data?.['breadcrumb']) {
        breadcrumbs.push({ label: child.data['breadcrumb'], url: nextUrl });
      }

      this.buildBreadcrumbs(child, nextUrl, breadcrumbs);
    }

    return breadcrumbs;
  }

  private joinUrls(base: string, path: string): string {
    if (!base.endsWith('/')) {
      base += '/';
    }
    if (path.startsWith('/')) {
      path = path.substring(1);
    }
    return base + path;
  }
}
