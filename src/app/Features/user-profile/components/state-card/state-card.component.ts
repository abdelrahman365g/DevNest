import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-state-card',
  imports: [],
  templateUrl: './state-card.component.html',
  styleUrl: './state-card.component.css',
})
export class StateCardComponent {

  @Input() title: string = '';
  @Input() count: number = 0;

}
