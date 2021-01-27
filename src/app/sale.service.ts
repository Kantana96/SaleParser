import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sale } from './model/Sale';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  baseUrl:string = "http://localhost:8080/sales/";
  constructor(private http: HttpClient) { }
  getAllSales(){
    return this.http.get<Sale[]>(this.baseUrl);
  }
  getSale(id:number){
    return this.http.get<Sale>(this.baseUrl+id);
  }
  createSale(sale:Sale){
    return this.http.post(this.baseUrl,sale);
  }
  updateSale(sale:Sale,id:string){
    return this.http.put(this.baseUrl+id,sale);
  }
  parseFile(file:File){
    const formData:FormData = new FormData();
    formData.append("file",file);
    return this.http.post(this.baseUrl+"file",formData);
  }
  deleteSale(id:number){
    return this.http.delete(this.baseUrl+id);
  }
}
