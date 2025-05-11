export interface ResponseObject<T> {
    ErrorMessage?: string;
    SuccessMessage?: string;
    success?: string;
    Results?: T;
    Token?: string;
    FinacialPeriod: string;
    XPagination?: XPagination;
    Id?: number;
    data?: any;
    roles?:any;
    token: any;
    meta?: any;
    message?:any;
    notification?: any;
}

export interface Entity<T> {
    Id: number;
    Entity: T;
}

export interface Error {
    errors: Errors;
    type: string;
    title: string;
    status: number;
    traceId: string;
}

export interface Errors {
    ShortName: string[];
}

export interface XPagination {
    TotalCount: number;
    PageSize: number;
    CurrentPage: number;
    TotalPages: number;
    HasNext: boolean;
    HasPrevious: boolean;
}
