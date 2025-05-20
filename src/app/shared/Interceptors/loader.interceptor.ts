import { HttpInterceptorFn } from '@angular/common/http';
import { LoaderService } from '../services/loader.service';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import {  SKIP_LOADER } from '../tokens/loader-context.token'

let requestCount = 0;

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  const skipLoader = req.context.get(SKIP_LOADER);
  // console.log('Loader skipped?', skipLoader);
  console.log('📦 Request:', req.url, '| Skip loader?', skipLoader);



  if (!skipLoader) {
    requestCount++;
    loaderService.show();
  }
  

  return next(req).pipe(
    finalize(() => {
      if (!skipLoader) {
        requestCount--;
      if (requestCount === 0) {
        loaderService.hide();
      }
      }
    })
  );
};
