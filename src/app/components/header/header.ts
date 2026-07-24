import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { filter } from 'rxjs/internal/operators/filter';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  private router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('navContainer') navContainer!: ElementRef<HTMLElement>;

  currentShortLang: string = 'es';
  currentTheme: string = 'dark';

  ngOnInit() {
    // Set current theme
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', this.currentTheme);

    // Init glass position based on the current route
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        take(1),
      )
      .subscribe((event: NavigationEnd) => this.initGlassPosition(event.urlAfterRedirects));
  }

  initGlassPosition(url: string) {
    const item = this.selectTargetItem(url);
    this.updateGlassPosition(item);
  }

  selectTargetItem(url: string): HTMLElement {
    let position = 0;
    switch (url) {
      case '/experience':
        position = 1;
        break;
      case '/skills':
        position = 2;
        break;
      case '/setup':
        position = 3;
        break;
      case '/contact':
        position = 4;
        break;
    }
    const element = this.navContainer.nativeElement.querySelectorAll('.item')[position];
    element.classList.add('active');
    return element as HTMLElement;
  }

  setActive(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const currentActive = this.navContainer.nativeElement.querySelector('.item.active');
    currentActive?.classList.remove('active');
    target.classList.add('active');
    // Add a transition class to the active glass for smooth animation
    const activeGlass = this.navContainer.nativeElement.querySelector(
      '.active-glass',
    ) as HTMLElement;
    activeGlass.classList.add('transition');
    // Update the position of the active glass
    this.updateGlassPosition(target);
  }

  updateGlassPosition(itemActive: HTMLElement) {
    this.navContainer.nativeElement.style.setProperty(
      '--active-glass-left',
      `${itemActive.offsetLeft}px`,
    );
    this.navContainer.nativeElement.style.setProperty(
      '--active-glass-width',
      `${itemActive.offsetWidth}px`,
    );
    this.cdr.detectChanges();
  }

  toggleTheme() {
    if (this.currentTheme === 'light') this.currentTheme = 'dark';
    else this.currentTheme = 'light';

    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }
}
