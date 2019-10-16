import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  csvPath: string = "/assets/sachin.csv";
  option = {
    header:true
  }
  data: any;
  totalBattingScore: string;
  countriesPlayedAgainst: any;
  totalMatches = 0;
  constructor(private parser: Papa, private http: HttpClient) { }

  ngOnInit() {
        this.http.get(this.csvPath,{responseType:'text'}).subscribe(next => {
          this.data = this.parser.parse(next, this.option);
          this.data = this.data["data"];
          
          let totalScore = [];
          
          this.countriesPlayedAgainst = Array.from(new Set(this.data.map(
            res => res.opposition
          ))).filter(x => x!=undefined).sort();
          let count = 0;
          this.countriesPlayedAgainst.forEach(element => {
              totalScore.push(this.getBattingScoreVsOpponents(element));
          });
          
          this.totalBattingScore = totalScore.reduce((a,c) => a+c);
          //console.log(this.countriesPlayedAgainst);

        });
  }

  getBattingScoreVsOpponents(country){
      
      let batting_score = this.data
                              .filter( score => score.opposition === country)
                              .map( score => parseInt(score.batting_score))
                              .filter( score => !isNaN(score))
                              .reduce((a,c) => a+c);
          return batting_score;
  }


}
