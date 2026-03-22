import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { IntroComponent } from "../../../Features/auth/components/intro/intro.component";

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, IntroComponent, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent {

}
