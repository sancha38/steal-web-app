import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';


import { RawMaterialImp} from '../_models';

interface Columns{
	data: string, 
	title: string, 
	visible: boolean
  }
@Injectable()

export class ApiService {


    constructor(private http: HttpClient) { }
	
	private _handle_error(error: any) {
		if (error.status == 401 || error.status == 302 || error.status == 10 || error.status == 403) {
			window.localStorage.clear();
			window.sessionStorage.clear();
			if ('_body' in error) {
				var link = error._body;
				if (link.indexOf('http') !== -1) {
					location.href = link;
				}
			}
			else {
				location.reload();
			}
			location.reload();
		};
		let message: string = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		return Observable.throw(message);
	}

	getChallanNo(action){
		let baseruri = environment.origin + environment.api;
        return this.http.get(`${baseruri}/challan/${action}`);
	
	}	
    getRawAll() {
		let baseruri = environment.origin + environment.api;
        return this.http.get(`${baseruri}/rawproduct`);
	}
	getSemiFinishedAll(){
		let baseruri = environment.origin + environment.api;
        return this.http.get(`${baseruri}/semifinishedoduct`);
	}
	getRawCfg(searchparms){
		let baseruri = environment.origin + environment.api;
		return this.http.post(`${baseruri}/mappedraw`, searchparms);
	}
	
	saveRaw(data){
		let baseruri = environment.origin + environment.api;
		return this.http.post(`${baseruri}/rawproduct`, data);
	}
	saveSemiProduct(data){
		let baseruri = environment.origin + environment.api;
		return this.http.post(`${baseruri}/semifinishedoduct`,data);
	}
	getFinishedlist() {
		let baseruri = environment.origin + environment.api;
        return this.http.get(`${baseruri}/finishedproduct`);
	}
	getFinishedPrdCfg(search){
		let baseruri = environment.origin + environment.api;
        return this.http.post(`${baseruri}/finishedcfg`,search);
	}
	saveProducttxn(data){
		let baseruri = environment.origin + environment.api;
		return this.http.post(`${baseruri}/finishedproduct`, data);
	}
	/*
	get_stock_in_hand(url){
		console.log("uri",url)
		let baseruri = environment.origin + environment.api;
		return this.http.get<Map<String,StockInHand[]>>(`${baseruri}/${url}`);
	}*/
	saveSales(data){
		let baseruri = environment.origin + environment.api;
		return this.http.post(`${baseruri}/isales`, data);
	}
	searchChallan(type,id){
		let baseruri = environment.origin + environment.api;
		return this.http.get<[]>(`${baseruri}/searchChallan/${type}/${id}`);
	}
	searchChallanFin(id){
		let baseruri = environment.origin + environment.api;
		const type ='Fin'
		return this.http.get(`${baseruri}/searchChallan/${type}/${id}`);
	}
	searchChallanSales(id){
		let baseruri = environment.origin + environment.api;
		const type ='Sal'
		return this.http.get(`${baseruri}/searchChallan/${type}/${id}`);
	}
	searchReportOptions(){
		let baseruri = environment.origin + environment.api;
		return this.http.get(`${baseruri}/reportoption`);
	}
	getSIH(id){
		let baseruri = environment.origin + environment.api;
		return this.http.get(`${baseruri}/stockinhand/${id}`);
	}
	getTransactionData(id,searchParams){
		console.log("id ",id)
		console.log("searchParams ",searchParams)
		let baseruri = environment.origin + environment.api;
		return this.http.post(`${baseruri}/transactions/${id}`,searchParams);
	}
	getOptions(id,lookingForid){
		let baseruri = environment.origin + environment.api;
		return this.http.get<Array<Columns>>(`${baseruri}/dataoptions/${id}/${lookingForid}`);
	}
}
