import {
  Component,
  ElementRef,
  HostListener,
  inject,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Stored_Keys } from '../../../Core/constants/stored_keys';
import { TranslationService } from '../../../Core/services/translation.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive , TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  router = inject(Router);
  translate = inject(TranslationService);
  isOpen: boolean = false;
  userId = localStorage.getItem(Stored_Keys.USER_ID) || '';
  userData = JSON.parse(localStorage.getItem(Stored_Keys.USER_DATA) || '{}');

  @ViewChild('dropdownBtn') dropdownBtn!: ElementRef;
  @ViewChild('dropdown') dropdownMenu!: ElementRef;

  @HostListener('document:click', ['$event'])
  outsideClick(event: Event) {
    const target = event.target as HTMLElement;

    if (
      this.dropdownBtn &&
      this.dropdownMenu &&
      !this.dropdownBtn.nativeElement.contains(target) &&
      !this.dropdownMenu.nativeElement.contains(target)
    ) {
      this.isOpen = false;
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }
  logout() {
    localStorage.removeItem(Stored_Keys.USER_TOKEN);
    localStorage.removeItem(Stored_Keys.USER_DATA);
    this.router.navigate(['/login']);
  }
  switchLanguage(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.translate.switchLanguage(value);
  }
}
