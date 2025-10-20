import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

interface Breadcrumb {
  label: string;
  url: string;
}
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <nav aria-label="breadcrumb" class="max-w-[1500px] mx-auto px-3 2xl:px-5 py-5 bg-gradient-to-r from-dark via-zinc-900 to-dark">
      <ol class="flex flex-wrap items-start gap-1">
        <li *ngFor="let crumb of breadcrumbs; let last = last" class="flex items-center">
          <ng-container *ngIf="!last; else lastBreadcrumb">
            <a [routerLink]="crumb.url"
               class="text-white hover:underline underline-offset-4 duration-300 hover:text-brand">
              {{ crumb.label }}
            </a>
            <span class="ml-2 mx-1 text-gray-500">/</span>
          </ng-container>
          <ng-template #lastBreadcrumb>
            <span class="font-semibold text-gray-500">{{ crumb.label }}</span>
          </ng-template>
        </li>
      </ol>
    </nav>
  `
})
export class BreadcrumbComponent {
  @Input() breadcrumbs: Breadcrumb[] = [];
}
