import { Component, OnInit } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  pathOfCsv = "/assets/sachin.csv";
  config = {
    header: true,
  };  
  data: any;
  response: any;
  years = [];
  firstMatch: string;
  lastMatch: string;
  
  constructor(private parser : Papa,private http: HttpClient) { }

  ngOnInit() {
    this.http.get(this.pathOfCsv,{responseType:'text'}).subscribe(next =>{
      this.data = this.parser.parse(next,this.config);
      this.data = this.data["data"];
    

      let year = [];

      this.getBattingScoreVsDate().forEach(ele => year.push(parseInt(ele.substr(ele.length-4))));
      let distinctYear = new Set;
      year.forEach(year => distinctYear.add(year));
      this.years = [...distinctYear];
      this.firstMatch = this.years[0].toString();
      this.lastMatch = this.years[this.years.length-1];
    });
  }
  getBattingScoreVsDate(){
    let batting_score = this.data
    .map(score => (score.date))
    .filter(ele => ele != undefined)

return batting_score;
}

}
