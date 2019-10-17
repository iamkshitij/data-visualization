import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import { ChartOptions,ChartType,ChartDataSets } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
//import * as pluginDataLabels from 'chartjs-plugin-datalabels';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

//   public doughnutChartLabels: Label[] = ['50s', '100s'];
//  // public doughnutChartData: MultiDataSet;
//   // =[ [45,90] ]
//   public doughnutChartType: ChartType = 'doughnut';

  csvPath: string = "/assets/sachin.csv";
  option = {
    header:true
  }
  data: any;
  totalBattingScore: string;
  countriesPlayedAgainst: any;
  totalMatches = 0;
  avgScore:any;
  battingWinScore;
  highestScore;
  notOuts;
  scoreFirstInnings;
  scoreSecondInnings;
  centuries;
  halfCenturies;


  public doughnutChartLabels: Label[] = ['1st Innings', '2nd Innings'];

  public doughnutChartData: MultiDataSet;
  public doughnutChartType: ChartType = 'doughnut';
  
  public centuriesChartLabels : Label[] = ['50s','100s'];
  public centuriesChartData: MultiDataSet;
  public centuriesChartType: ChartType = 'doughnut';

  //  = [
  //   { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  //   { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  // ];

  
  constructor(private parser: Papa, private http: HttpClient) { }

  ngOnInit() {
        this.http.get(this.csvPath,{responseType:'text'}).subscribe(next => {
          this.data = this.parser.parse(next, this.option);
          this.data = this.data["data"];
          console.log(this.data)
          let totalScore = [];
          
          this.countriesPlayedAgainst = Array.from(new Set(this.data.map(
            res => res.opposition
          ))).filter(x => x!=undefined).sort();
          
          this.countriesPlayedAgainst.forEach(element => totalScore.push(this.getBattingScoreVsOpponents(element)));
          
          console.log(this.countriesPlayedAgainst);

          this.totalBattingScore = totalScore.reduce((a,c) => a+c);
          
          this.totalMatches = this.data.length;
          

          this.avgScore = Math.round((parseInt(this.totalBattingScore) / this.totalMatches) * 100) /100;

          this.battingWinScore = this.getBattingScoreWinning();

          this.highestScore = this.getHighestScore();

          this.notOuts = this.getNotOuts();
          
          this.scoreFirstInnings = this.getBattingScoreVsInnings("1st");
          this.scoreSecondInnings = this.getBattingScoreVsInnings("2nd");

       
   
          this.doughnutChartData = [[this.scoreFirstInnings,this.scoreSecondInnings]];
   
           this.centuries =  this.getCenturies("100");
          this.halfCenturies = this.getCenturies("50");

          this.centuriesChartData = [[this.halfCenturies,this.centuries]];
        });
  }

  getCenturies(type){
      let batting_score = this.data
                          
                              .filter(score => parseInt(score.batting_score) > type);
           
      return batting_score.length;                   

  }
  getBattingScoreVsInnings(innings){
    let batting_score = this.data
                            .filter( score => score.batting_innings == innings)
                            .map(score => parseInt(score.batting_score))
                            .filter(score => !isNaN(score))
                            .reduce((a,c)=> a+c)
                            ;
   // console.log(batting_score);                                
    return batting_score;
}


  getNotOuts(){
        let notOuts = this.data
                          .filter(score => (score.batting_score).includes('*'))
                          
            // console.log(notOuts.length);
            return notOuts;
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

  getHighestScore(){
        let highestScore = this.data  
                          .filter(score => score.stumps )
                          .map(score => parseInt(score.batting_score))
                          .filter(score => !isNaN(score))
            // highestScore =  Math.max.apply(Math, map( score => score ));           
            highestScore = Math.max(...highestScore.map(score => score))
        //console.log(highestScore);  
        return highestScore;                
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
