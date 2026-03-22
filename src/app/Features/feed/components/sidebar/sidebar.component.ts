import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { ScrollHeader } from '../../directives/scroll-header';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive , ScrollHeader],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {

}
