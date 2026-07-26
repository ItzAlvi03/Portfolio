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
  private currentUrl: string = '';

  @ViewChild('navContainer') navContainer!: ElementRef<HTMLElement>;

  currentLangPosition: number = 0;
  currentTheme: string = 'dark';
  languages: string[] = [];

  glassTransition: boolean = false; // Activate the transition effect after the first navigation
  langTransition: boolean = false; // Activate the transition effect after loading page

  ngOnInit() {
    // Set current theme
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', this.currentTheme);

    // Set current language
    const currentLang = this.translate.getCurrentLang() || 'es-ES';
    this.languages = [...this.translate.getLangs()];
    this.currentLangPosition = this.languages.indexOf(currentLang);

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
    if (!this.glassTransition) this.glassTransition = true;
    this.currentUrl = url;
    const item = this.selectTargetItem(url);
    // Update the position of the active glass
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
    if (!this.langTransition) this.langTransition = true;
    this.currentLangPosition = this.currentLangPosition == 0 ? 1 : 0;
    const newLang = this.languages[this.currentLangPosition];
    this.translate.use(newLang);
    localStorage.setItem('lang', newLang);
  }
}
