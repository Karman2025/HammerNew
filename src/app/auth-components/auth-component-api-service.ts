import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, filter } from 'rxjs';
import { HttpApiService } from '../server/http-api.service';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthComponentApiService {

    constructor(private api: HttpApiService) { }
    private readonly signinEndPoint = '/auth/signin';

    signin(data: any){
        return this.api.post<any[]>(this.signinEndPoint,data)
        .pipe(map((response) => response));
    }

}
