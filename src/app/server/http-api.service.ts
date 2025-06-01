import { Injectable } from '@angular/core';
import {
    HttpParams,
    HttpRequest,
    HttpClient,
    HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError, filter, first, tap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../src/environments/environment';

import { HTTPMethodType } from '../models/misc';
import { ResponseObject } from '../models/response';
import { LoaderService } from '../shared/services/loader.service';

@Injectable({
    providedIn: 'root',
})
export class HttpApiService {
    private static requestHistory = new Map<string, Object>();

    constructor(private httpClient: HttpClient, private router: Router, private loaderService: LoaderService) {}

    private submitRequest<T>(
        methodType: HTTPMethodType,
        endPoint: string,
        data: any = null,
        showLoader: boolean
    ): Observable<ResponseObject<T>> {
        const token = localStorage.getItem('USER-JWT-TOKEN'); // Retrieve token from storage or service
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '', // Add Bearer token
        });
        if(showLoader){
          this.loaderService.addRequestCount();
        }
        return this.httpClient
            .request<T>(methodType, `${environment.baseAPIUrl}${endPoint}`, {
                body: data,
                headers: headers,
                reportProgress: true,
                observe: 'response',
            })
            .pipe(
                map((httpResponse) => {
                    const headerString =
                        httpResponse.headers.get('X-Pagination');
                    const headerObj = JSON.parse(headerString ?? '{}');
                    return {
                        ErrorMessage: '',
                        Results: httpResponse?.body,
                        SuccessMessage: 'Success',
                        XPagination: headerObj,
                    } as ResponseObject<T>;
                }),
                catchError((error) => {
                  if(error.error.error == "jwt expired") {
                    localStorage.removeItem('USER-INFO');
                    localStorage.removeItem('USER-JWT-TOKEN');
                    this.router.navigate(['signin']);
                  }
                  if (error.status === 401) {
                      return of({
                          ErrorMessage: 'Server error',
                          Results: {} as T,
                          SuccessMessage: '',
                      } as ResponseObject<T>);
                  }
                  if (error.status === 409) {
                      return of({
                          ErrorMessage: error?.error,
                          Results: {} as T,
                          SuccessMessage: '',
                      } as ResponseObject<T>);
                  }
                  this.handleError(error);
                  return of({
                      ErrorMessage: 'Server error',
                      Results: {} as T,
                      SuccessMessage: '',
                  } as ResponseObject<T>);
                }),
                finalize(()=>{
                  if(showLoader){
                    this.loaderService.reduceRequestCount();
                  }
                })
            );
    }

    public post<T>(endPoint: string, data: any, showLoader:boolean = true) {
        return this.submitRequest<T>('Post', endPoint, data, showLoader);
    }

    public put<T>(endPoint: string, data: any, showLoader:boolean = true) {
        return this.submitRequest<T>('Put', endPoint, data, showLoader);
    }

    public get<T>(endPoint: string, showLoader:boolean = true) {
        return this.submitRequest<T>('Get', endPoint, null, showLoader);
    }

    public delete<T>(endPoint: string, data: any, showLoader:boolean = true) {
        return this.submitRequest<T>('Delete', endPoint, data, showLoader);
    }

    private handleError(error: Response) {
        /* return throwError( */ error || 'Server Error'; /* ); */
        // console.error(error || "Server Error");
    }
}
