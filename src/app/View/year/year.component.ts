import { Component, OnInit } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import { ChartDataSets, ChartOptions,ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { MultiDataSet } from 'ng2-charts';
@Component({
  selector: 'app-year',
  templateUrl: './year.component.html',
  styleUrls: ['./year.component.css']
})
export class YearComponent implements OnInit {
  pathOfCsv = "/assets/sachin.csv";
  config = {
    header: true,
  };  
  data: any;
  response: any;
  
  public lineChartData: ChartDataSets[] ;
  public lineChartLabels: Label[] =[];
  
  public lineChartType = 'line';
  public lineChartLegend = true;

  years = [];
  firstMatch: string;
  lastMatch: string;

  constructor(private parser : Papa,private http: HttpClient) { }

  ngOnInit() {

    this.http.get(this.pathOfCsv,{responseType:'text'}).subscribe(next =>{
      this.data = this.parser.parse(next,this.config);
      this.data = this.data["data"];
      let totalScore = [];

      let year = [];

      this.getBattingScoreVsDate().forEach(ele => year.push(parseInt(ele.substr(ele.length-4))));
      let distinctYear = new Set;
      year.forEach(year => distinctYear.add(year));
      this.years = [...distinctYear];
      this.years.forEach(year => totalScore.push(this.getBattingScoreVsYear(year)));
     
      this.lineChartLabels = this.years;
      this.lineChartData = [{data:totalScore,label:"Batting Score"}] ;
      this.firstMatch = this.years[0].toString();
      this.lastMatch = this.years[this.years.length-1];
      console.log(this.lastMatch)
      
    });

    
   }

 

   getBattingScoreVsYear(year){
     let resScore = 0;  
      this.data
              .map((x)=>{
      if(x.date != undefined && !isNaN(parseInt(x.batting_score))){
        if(x.date.includes(year)){
          resScore = resScore + parseInt(x.batting_score);
          //console.log(resScore)
    }
      }
        
    })
                           
    return resScore;
} 
  getBattingScoreVsDate(){
          let batting_score = this.data
          .map(score => (score.date))
          .filter(ele => ele != undefined)

      return batting_score;
}

getBattingScoreWinning(){
  let batting_score = this.data
                      .filter( score => score.match_result == "won")
                      .map(score => parseInt(score.batting_score))
                      .filter(score => !isNaN(score))
                      .reduce((a,c)=> a+c)
                      ;
                             
        return batting_score;
}

}
