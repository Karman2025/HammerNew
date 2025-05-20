import { Injectable } from '@angular/core';
import {
    HttpParams,
    HttpRequest,
    HttpClient,
    HttpHeaders,
} from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError, filter, first, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../src/environments/environment';

import { HTTPMethodType } from '../models/misc';
import { ResponseObject } from '../models/response';
import { HttpContext } from '@angular/common/http'; // add this
import { SKIP_LOADER } from '../shared/tokens/loader-context.token'; // import this

@Injectable({
    providedIn: 'root',
})
export class HttpApiService {
    private static requestHistory = new Map<string, Object>();

    constructor(private httpClient: HttpClient, private router: Router) {}

    private submitRequest<T>(
        methodType: HTTPMethodType,
        endPoint: string,
        data: any = null,
        context: HttpContext = new HttpContext()
    ): Observable<ResponseObject<T>> {
        const token = localStorage.getItem('USER-JWT-TOKEN'); // Retrieve token from storage or service
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '', // Add Bearer token
        });
        return this.httpClient
            .request<T>(methodType, `${environment.baseAPIUrl}${endPoint}`, {
                body: data,
                headers: headers,
                context,
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
                })
            );
    }

    public post<T>(endPoint: string, data: any, context?: HttpContext) {
        return this.submitRequest<T>('Post', endPoint, data, context);
    }

    public put<T>(endPoint: string, data: any, context?: HttpContext) {
        return this.submitRequest<T>('Put', endPoint, data, context);
    }

    public get<T>(endPoint: string, context?: HttpContext) {
        return this.submitRequest<T>('Get', endPoint, null, context);
    }

    public delete<T>(endPoint: string, data: any, context?: HttpContext) {
        return this.submitRequest<T>('Delete', endPoint, data, context);
    }

    private handleError(error: Response) {
        /* return throwError( */ error || 'Server Error'; /* ); */
        // console.error(error || "Server Error");
    }
}
