import { Injectable, computed, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private _requestCount = signal(0);
  readonly requestCount = this._requestCount.asReadonly();

  // _isLoading is computed based on _requestCount
  readonly isLoading = computed(() => {
    return this._requestCount() > 0;
  });

  constructor() { }

  addRequestCount() {
    this._requestCount.set(this._requestCount() + 1);
  }

  reduceRequestCount() {
    this._requestCount.set(this._requestCount() - 1);
  }
}
