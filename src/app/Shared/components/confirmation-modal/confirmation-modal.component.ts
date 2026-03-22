import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  imports: [],
  templateUrl: './confirmation-modal.component.html',
  styleUrl: './confirmation-modal.component.css',
})
export class ConfirmationModalComponent {
  @Input() show: boolean = false;
  @Output() confirm = new EventEmitter<boolean>();

  @ViewChild('backdrop') backdrop!: ElementRef;
  @ViewChild('modal') modal!: ElementRef;
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.modal?.nativeElement) return;

    const clickedInside = this.modal.nativeElement.contains(event.target);
    const backdropClick = this.backdrop.nativeElement.contains(event.target);

    if (!clickedInside && backdropClick) {
      this.closeModal();
    }
  }

  onConfirm(): void {
    this.confirm.emit(true);
    this.show = false;
  }

  onCancel(): void {
    this.confirm.emit(false);
    this.show = false;
  }

  closeModal(): void {
    this.confirm.emit(false);
    this.show = false;
  }
}
