import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { delay, skip } from 'rxjs';
import { filter } from 'rxjs/internal/operators/filter';

@Component({
  selector: 'app-header',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  private router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private translate = inject(TranslateService);
  private activeGlassTransition: boolean = false; // Activate the transition effect after the first navigation
  private currentUrl: string = '';

  @ViewChild('navContainer') navContainer!: ElementRef<HTMLElement>;

  currentShortLang: string = 'es';
  currentTheme: string = 'dark';

  ngOnInit() {
    // Set current theme
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', this.currentTheme);

    // Set current language
    const currentLang = this.translate.getCurrentLang() || 'es-ES';
    this.currentShortLang = currentLang?.split('-')[0] || 'es';

    // Init glass position based on the current route
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => this.changeGlassPosition(event.urlAfterRedirects));

    // Subscribe to lang changes
    this.translate.onLangChange
      .pipe(delay(50))
      .subscribe(() => this.changeGlassPosition(this.currentUrl));
  }

  changeGlassPosition(url: string) {
    this.currentUrl = url;
    const item = this.selectTargetItem(url);
    // Update the position of the active glass
    this.updateGlassPosition(item);
    if (!this.activeGlassTransition) {
      this.activeGlassTransition = true;
      // Add a transition class to the active glass for smooth animation
      const activeGlass = this.navContainer?.nativeElement?.querySelector(
        '.active-glass',
      ) as HTMLElement;
      activeGlass?.classList?.add('transition');
    }
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

    // Remove current active class from the previously active item
    const currentActive = this.navContainer?.nativeElement?.querySelector('.item.active');
    if (currentActive) currentActive.classList.remove('active');
    // Add active class to the new item selected
    const element = this.navContainer?.nativeElement?.querySelectorAll('.item')[position];
    element?.classList.add('active');

    return element as HTMLElement;
  }

  updateGlassPosition(itemActive: HTMLElement) {
    this.navContainer?.nativeElement?.style.setProperty(
      '--active-glass-left',
      `${itemActive?.offsetLeft}px`,
    );
    this.navContainer?.nativeElement?.style.setProperty(
      '--active-glass-width',
      `${itemActive?.offsetWidth}px`,
    );
    this.cdr.detectChanges();
  }

  toggleTheme() {
    if (this.currentTheme === 'light') this.currentTheme = 'dark';
    else this.currentTheme = 'light';

    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }

  toggleLang() {
    const newLang = this.currentShortLang === 'es' ? 'en-GB' : 'es-ES';
    this.translate.use(newLang);
    localStorage.setItem('lang', newLang);
    this.currentShortLang = newLang.split('-')[0];
  }
}
