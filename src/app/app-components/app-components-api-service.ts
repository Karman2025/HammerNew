import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, filter } from 'rxjs';
import { HttpApiService } from '../server/http-api.service';
import { environment } from '../../environments/environment';
import { HttpContext } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AppComponentsApiService {

    constructor(
      private api: HttpApiService,
    ) { }
    private readonly getAllBranchEndPoint = '/admin/branch/getAllBranch';
    private readonly createBranchEndPoint = '/admin/branch/createBranch';
    private readonly updateBranchEndPoint = '/admin/branch/updateBranch';
    private readonly getAllBranchAutocompleteEndPoint = '/admin/branch/getAllBranchAutocomplete';

    private readonly getAllTrainerEndPoint = '/admin/trainer/getAllTrainer';
    private readonly createTrainerEndPoint = '/admin/trainer/createTrainer';
    private readonly updateTrainerEndPoint = '/admin/trainer/updateTrainer';

    private readonly getCustomerDetailsByIdEndPoint = '/admin/customer/getCustomerDetailsById';
    private readonly getAllCustomerEndPoint = '/admin/customer/getAllCustomer';
    private readonly createCustomerEndPoint = '/admin/customer/createCustomer';
    private readonly updateCustomerEndPoint = '/admin/customer/updateCustomer';
    private readonly deleteCustomerEndPoint = '/admin/customer/deleteCustomer';

    private readonly addUpdateDietPlansEndPoint = '/admin/diet/addUpdateDietPlans';

    private readonly getAllAttendanceEndPoint = '/admin/attendence/getAllAttendance';
    private readonly checkInCustomerEndPoint = '/admin/attendence/checkIn';

    private readonly getAllCustomerPaymentPlansEndPoint = '/admin/payment/getAllCustomerPaymentPlans';
    private readonly createCustomerPaymentPlanEndPoint = '/admin/payment/createCustomerPaymentPlan';
    private readonly updateCustomerPaymentPlanEndPoint = '/admin/payment/updateCustomerPaymentPlan';
    private readonly payCustomerBalancePaymentPlanEndPoint = '/admin/payment/payCustomerBalancePaymentPlan';

    private readonly getAllAccountsEndPoint = '/admin/accounts/getAllAccounts';
    private readonly createAccountEntryEndPoint = '/admin/accounts/createAccountEntry';
    private readonly updateAccountEntryEndPoint = '/admin/accounts/updateAccountEntry';

    getAllBranch(params:any){
        let endPoint = '?';
        for (let key in params) {
            if (params.hasOwnProperty(key) && (params[key] || params[key] == true || params[key] == false)) {
                endPoint += `${endPoint.length > 1 ? '&' : ''}${key}=${params[key]}`;
            }
        }
        return this.api.get<any[]>(`${this.getAllBranchEndPoint}${endPoint}`)
        .pipe(map((response) => response));
    }

    getAllBranchAutocompleteData(showLoader: boolean = true){
      return this.api.get<any[]>(`${this.getAllBranchAutocompleteEndPoint}`, showLoader)
      .pipe(map((response) => response?.Results ?? []));
    }

    createBranch(data: any){
        return this.api.post<any[]>(this.createBranchEndPoint,data)
        .pipe(map((response) => response));
    }

    updateBranch(data: any){
        return this.api.put<any[]>(this.updateBranchEndPoint+'?branchId='+data?._id,data)
        .pipe(map((response) => response));
    }

    getAllTrainer(params:any){
        let endPoint = '?';
        for (let key in params) {
            if (params.hasOwnProperty(key) && (params[key] || params[key] == true || params[key] == false)) {
                endPoint += `${endPoint.length > 1 ? '&' : ''}${key}=${params[key]}`;
            }
        }
        return this.api.get<any[]>(`${this.getAllTrainerEndPoint}${endPoint}`)
        .pipe(map((response) => response));
    }

    createTrainer(data: any){
        return this.api.post<any[]>(this.createTrainerEndPoint,data)
        .pipe(map((response) => response));
    }

    updateTrainer(data: any){
        return this.api.put<any[]>(this.updateTrainerEndPoint+'?trainerId='+data?._id,data)
        .pipe(map((response) => response));
    }

    getAllCustomer(params:any){
      let endPoint = '?';
        for (let key in params) {
            if (params.hasOwnProperty(key) && (params[key] || params[key] == true || params[key] == false)) {
                endPoint += `${endPoint.length > 1 ? '&' : ''}${key}=${params[key]}`;
            }
        }
      return this.api.get<any[]>(`${this.getAllCustomerEndPoint}${endPoint}`)
      .pipe(map((response) => response));
    }

    createCustomer(data: any){
      return this.api.post<any[]>(this.createCustomerEndPoint,data)
      .pipe(map((response) => response));
    }

    updateCustomer(data: any){
      return this.api.put<any[]>(this.updateCustomerEndPoint+'?customerId='+data?._id,data)
      .pipe(map((response) => response));
    }

    getCustomerDetailsById(customerId:any){
      return this.api.get<any[]>(`${this.getCustomerDetailsByIdEndPoint}?customerId=${customerId}`)
      .pipe(map((response) => response?.Results ?? {}));
    }

    addUpdateDietPlans(data: any){
      return this.api.put<any[]>(this.addUpdateDietPlansEndPoint,data)
      .pipe(map((response) => response));
    }

    getAllAttendance(params: any, showLoader:boolean = true) {
      let endPoint = '?';
        for (let key in params) {
            if (params.hasOwnProperty(key) && (params[key] || params[key] == true || params[key] == false)) {
                endPoint += `${endPoint.length > 1 ? '&' : ''}${key}=${params[key]}`;
            }
        }
      return this.api.get<any[]>(`${this.getAllAttendanceEndPoint}${endPoint}`, showLoader)
      .pipe(map((response) => response));
    }

    customerCheckIn(data: any, showLoader: boolean = true) {
        return this.api.post<any[]>(this.checkInCustomerEndPoint, data, showLoader)
        .pipe(map((response) => response));
    }

    getAllCustomerPaymentPlans(params: any) {
      let endPoint = '?';
        for (let key in params) {
            if (params.hasOwnProperty(key) && (params[key] || params[key] == true || params[key] == false)) {
                endPoint += `${endPoint.length > 1 ? '&' : ''}${key}=${params[key]}`;
            }
        }
      return this.api.get<any[]>(`${this.getAllCustomerPaymentPlansEndPoint}${endPoint}`)
      .pipe(map((response) => response));
    }

    createCustomerPaymentPlan(data: any){
      return this.api.post<any[]>(this.createCustomerPaymentPlanEndPoint,data)
      .pipe(map((response) => response));
    }

    updateCustomerPaymentPlan(data: any){
      return this.api.put<any[]>(this.updateCustomerPaymentPlanEndPoint+'?customerPaymentPlanId='+data?._id,data)
      .pipe(map((response) => response));
    }

    payCustomerBalancePaymentPlan(data: any){
      return this.api.put<any[]>(this.payCustomerBalancePaymentPlanEndPoint+'?customerPaymentPlanId='+data?._id,data)
      .pipe(map((response) => response));
    }

    getAllAccounts(params: any) {
      let endPoint = '?';
        for (let key in params) {
            if (params.hasOwnProperty(key) && (params[key] || params[key] == true || params[key] == false)) {
                endPoint += `${endPoint.length > 1 ? '&' : ''}${key}=${params[key]}`;
            }
        }
      return this.api.get<any[]>(`${this.getAllAccountsEndPoint}${endPoint}`)
      .pipe(map((response) => response));
    }

    createAccountEntry(data: any){
      return this.api.post<any[]>(this.createAccountEntryEndPoint,data)
      .pipe(map((response) => response));
    }

    updateAccountEntry(data: any){
      return this.api.put<any[]>(this.updateAccountEntryEndPoint,data)
      .pipe(map((response) => response));
    }

    deleteCustomer(customerId: any){
      return this.api.put<any[]>(this.deleteCustomerEndPoint + "?customerId=" + customerId,null)
      .pipe(map((response) => response));
    }
}
