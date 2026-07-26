import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { delay } from 'rxjs';
import { filter } from 'rxjs/internal/operators/filter';

@Component({
  selector: 'app-header',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit, AfterViewInit, OnDestroy {
  private router = inject(Router);
  private translate = inject(TranslateService);
  private currentUrl: string = '';
  private resizeObserver!: ResizeObserver;

  @ViewChild('navContainer') navContainer!: ElementRef<HTMLElement>;

  currentLangPosition: number = 0;
  currentTheme: string = 'dark';
  languages: string[] = [];
  // Glass position and width
  glassLeft = signal(0);
  glassWidth = signal(0);

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
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
        this.changeGlassPosition();
      });
  }

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver(() => this.changeGlassPosition());
    this.resizeObserver.observe(this.navContainer.nativeElement);
  }

  changeGlassPosition() {
    const item = this.selectTargetItem(this.currentUrl);
    // Update the position of the active glass
    this.glassLeft.set(item?.offsetLeft);
    this.glassWidth.set(item?.offsetWidth);
    if (!this.glassTransition) {
      setTimeout(() => {
        this.glassTransition = true;
      }, 10);
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

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
  }
}
