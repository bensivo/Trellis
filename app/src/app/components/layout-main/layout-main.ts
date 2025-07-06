import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, UrlSegment } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

@Component({
  selector: 'app-layout-main',
  imports: [
    RouterLink
  ],
  templateUrl: './layout-main.html',
  styleUrl: './layout-main.less'
})
export class LayoutMain {
  readonly router = inject(Router);
  readonly url = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );
}
