import { Component, Renderer2, ElementRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss'],
})
export class ThemeSwitcherComponent {
  isDark = false;

  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.isDark = localStorage.getItem('useDarkTheme') === 'true';
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    if (this.isDark) {
      this.renderer.setAttribute(this.el.nativeElement.ownerDocument.body, 'data-theme', 'dark');
      localStorage.setItem('useDarkTheme', 'true');
    } else {
      this.renderer.removeAttribute(this.el.nativeElement.ownerDocument.body, 'data-theme');
      localStorage.setItem('useDarkTheme', 'false');
    }
  }
}
