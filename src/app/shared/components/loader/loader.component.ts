import { Component, inject } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { getOffsetHeightForCard } from '../../functions/calcHeightOffset';

@Component({
  selector: 'app-loader',
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  loaderService = inject(LoaderService);
  isLoading = this.loaderService.isLoading;
  getOffsetHeightForCard(extra: any = 0) {
    return getOffsetHeightForCard(extra);
  }
}
