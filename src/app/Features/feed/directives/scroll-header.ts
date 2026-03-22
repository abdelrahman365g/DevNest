import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appScrollHeader]',
})
export class ScrollHeader implements OnInit {
  private headerHeight = 62;
  private mobileBreakpoint = 1280;
  private prevScrollpos = window.pageYOffset;
  private currentTop = 0;
  private isMobile = false;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.checkIfMobile();
    if (this.isMobile) {
      this.turnMobile();
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.checkIfMobile();
    if (!this.isMobile) {
      this.turnLaptop();
    } else {
      this.turnMobile();
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    if (!this.isMobile) return;

    const currentScrollPos = window.pageYOffset;
    const delta = this.prevScrollpos - currentScrollPos;

    this.currentTop += delta;
    this.currentTop = Math.min(
      58,
      Math.max(-this.headerHeight, this.currentTop),
    );

    this.el.nativeElement.style.top = `${this.currentTop}px`;

    this.prevScrollpos = currentScrollPos;
  }

  checkIfMobile(): void {
    this.isMobile = window.innerWidth < this.mobileBreakpoint;
  }

  turnLaptop(): void {
    this.el.nativeElement.style.position = 'sticky';
    this.el.nativeElement.style.top = '72px';
    this.el.nativeElement.style.left = '0';
  }
  turnMobile(): void {
    this.el.nativeElement.style.position = 'fixed';
    this.el.nativeElement.style.top = '58px';
    this.el.nativeElement.style.left = '0';
    this.el.nativeElement.style.transition = 'top 0.4s';
  }
}
