import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private _isLoading = signal(false);
  readonly isLoading = this._isLoading.asReadonly();
  
  constructor() { }
  
  show() {
    this._isLoading.set(true);
  }

  hide() {
    this._isLoading.set(false);
  }
}
