import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'slide-button',
  templateUrl: './slide-button.component.html',
  styleUrls: ['./slide-button.component.css'],
  imports: [CommonModule]
})
export class SlideButtonComponent implements AfterViewInit {

  // @Output() onSlide = new EventEmitter<void>();
  // @Input() isCheckedIn: boolean = false;

  // isFullySlided: boolean = false;

  // constructor() { }

  // ngOnInit() {
  // }

  // onSlideToConfirm(event: any) {
  //   const slider = event.target;
  //   const value = +slider.value;

  //   // const isFullySlid = slider.value >= 100;

  //   if (value >= 100 && !this.isCheckedIn) {
  //     this.isCheckedIn = true;
  //     this.onSlide.emit();
  //   }

  //   // Detect when the user releases the slider and reset only if not fully slid
  //   slider.addEventListener('mouseup', () => {
  //     if (!this.isCheckedIn) {
  //       setTimeout(() => (slider.value = 0), 300);
  //     }
  //   }, { once: true }); // Ensures the event runs only once per slide action
  // }

  @Input() isCheckedIn: boolean = false;
  @Input() isDisable: boolean = false;
  @Output() onSlide = new EventEmitter<void>();
  @ViewChild('thumb', { static: false }) thumb?: ElementRef;
  @ViewChild('track', { static: false }) track?: ElementRef;

  private dragging = false;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.thumb || !this.track) {
        console.warn('Thumb or track not found — probably due to *ngIf and check-in state');
        return;
      }
    const thumbEl = this.thumb.nativeElement;
    const trackEl = this.track.nativeElement;

    let startX = 0;
    let maxX = trackEl.offsetWidth - thumbEl.offsetWidth;

    const onMouseMove = (event: MouseEvent) => {
      if (!this.dragging || this.isCheckedIn) return;

      let deltaX = event.clientX - startX;
      deltaX = Math.max(0, Math.min(deltaX, maxX));

      this.renderer.setStyle(thumbEl, 'left', `${deltaX}px`);
    };

    const onMouseUp = () => {
      if (!this.dragging || this.isCheckedIn) return;

      const thumbLeft = parseInt(thumbEl.style.left || '0');
      if (thumbLeft >= maxX - 10) {
        this.isCheckedIn = true;
        this.renderer.setStyle(thumbEl, 'left', `${maxX}px`);
        this.onSlide.emit();
      } else {
        this.renderer.setStyle(thumbEl, 'left', '0px');
      }

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
    })
  }

  getStatusText(): string {
    if (this.isDisable && !this.isCheckedIn) return 'Not checked in';
    if (this.isCheckedIn) return 'Checked in';
    return 'Slide to check in';
  }

  getTextColor(): string {
    if (this.isDisable && !this.isCheckedIn) return '#dc3545';
    if (this.isCheckedIn) return '#28a745';
    // return '#444';
    return '#81a4bd';
  }
}
