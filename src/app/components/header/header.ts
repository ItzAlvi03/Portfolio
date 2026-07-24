import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  currentShortLang: string = 'es';
  currentTheme: string = 'dark';

  ngOnInit() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
  }

  toggleTheme() {
    if (this.currentTheme === 'light') this.currentTheme = 'dark';
    else this.currentTheme = 'light';

    document.documentElement.setAttribute('data-theme', this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }
}
