import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'slide-button',
  templateUrl: './slide-button.component.html',
  styleUrls: ['./slide-button.component.css'],
  imports: [CommonModule]
})
export class SlideButtonComponent implements AfterViewInit {
  @Input() isCheckedIn = false;
  @Input() isDisable = false;
  @Output() onSlide = new EventEmitter<void>();
  @ViewChild('thumb', { static: false }) thumb?: ElementRef;
  @ViewChild('track', { static: false }) track?: ElementRef;

  private dragging = false;
  private maxX = 0;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.thumb || !this.track) {
        console.warn('Thumb or track not found — probably due to *ngIf and check-in state');
        return;
      }
      this.maxX = this.track.nativeElement.offsetWidth - this.thumb.nativeElement.offsetWidth;
      this.initMouseEvents();
      this.initTouchEvents();
    });
  }

  private initMouseEvents(): void {
    const thumbEl = this.thumb!.nativeElement;

    let startX = 0;

    const onMouseMove = (event: MouseEvent) => {
      if (!this.dragging || this.isCheckedIn) return;
      let deltaX = event.clientX - startX;
      deltaX = this.clamp(deltaX, 0, this.maxX);
      this.renderer.setStyle(thumbEl, 'left', `${deltaX}px`);
    };

    const onMouseUp = () => {
      if (!this.dragging || this.isCheckedIn) return;
      this.handleSlideEnd(parseInt(thumbEl.style.left || '0'));
      this.dragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    this.renderer.listen(thumbEl, 'mousedown', (event: MouseEvent) => {
      if (this.isCheckedIn || this.isDisable) return;
      this.dragging = true;
      startX = event.clientX - thumbEl.offsetLeft;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  private initTouchEvents(): void {
    const thumbEl = this.thumb!.nativeElement;

    if ((thumbEl as any)._touchListenerAdded) return;
    (thumbEl as any)._touchListenerAdded = true;

    let startX = 0;

    const onTouchMove = (event: TouchEvent) => {
      if (!this.dragging || this.isCheckedIn) return;
      const touch = event.touches[0];
      let deltaX = touch.clientX - startX;
      deltaX = this.clamp(deltaX, 0, this.maxX);
      this.renderer.setStyle(thumbEl, 'left', `${deltaX}px`);
    };

    const onTouchEnd = () => {
      if (!this.dragging || this.isCheckedIn) return;
      this.handleSlideEnd(parseInt(thumbEl.style.left || '0'));
      this.dragging = false;
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };

    this.renderer.listen(thumbEl, 'touchstart', (event: TouchEvent) => {
      if (this.isCheckedIn || this.isDisable) return;
      this.dragging = true;
      const touch = event.touches[0];
      startX = touch.clientX - thumbEl.offsetLeft;
      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('touchend', onTouchEnd);
    });
  }

  private handleSlideEnd(thumbLeft: number): void {
    const thumbEl = this.thumb!.nativeElement;
    if (thumbLeft >= this.maxX - 10) {
      this.isCheckedIn = true;
      this.renderer.setStyle(thumbEl, 'left', `${this.maxX}px`);
      this.onSlide.emit();
    } else {
      this.renderer.setStyle(thumbEl, 'left', '0px');
    }
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(value, max));
  }

  getStatusText(): string {
    if (this.isDisable && !this.isCheckedIn) return 'Not checked in';
    if (this.isCheckedIn) return 'Checked in';
    return 'Slide to check in';
  }

  getTextColor(): string {
    if (this.isDisable && !this.isCheckedIn) return '#dc3545';
    if (this.isCheckedIn) return '#28a745';
    return '#81a4bd';
  }
}

