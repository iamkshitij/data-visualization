import { Injectable } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  pathOfCsv = "/assets/sachin.csv";
  config = {
    header: true,
  };
  data: any;
  response: any;
  constructor(private parser : Papa,private http: HttpClient) {
    
    this.response = this.http
    .get(this.pathOfCsv,{responseType:'text'})
    
    // .subscribe(res => this.getCsvData(this.parser.parse(res,this.config)));
    
   }

  getCsvData(){
      this.response.subscribe( res => 
        this.data = (this.parser.parse(res,this.config))
        )
        
  }

}
