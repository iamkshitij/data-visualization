import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';
import { ChartOptions,ChartType,ChartDataSets } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';


@Component({
  selector: 'app-opponents',
  templateUrl: './opponents.component.html',
  styleUrls: ['./opponents.component.css']
})
export class OpponentsComponent implements OnInit {

  csvPath: string = "/assets/sachin.csv";
  option = {
    header:true
  }

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public barChartLabels: Label[] ;
  // = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartData: ChartDataSets[] ;
  public barChartData1: ChartDataSets[] ;
  public barChartData2: ChartDataSets[] ;
  public barChartData3: ChartDataSets[] ;
  // = [
  //   { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    
  // ];
   public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  data;
  countriesList;
  totalScore=[];
  tabledata=[];
  constructor(private parser: Papa, private http: HttpClient) { }
  country;
  score;
  centuriesCountry=[];
  halfCenturiesCountry=[];
  winGames = [];
  totalBattingScore;
  totalCatches= [];
  totalWickets= [];

  ngOnInit() {
    this.http.get(this.csvPath,{responseType:'text'}).subscribe(next => {
      this.data = this.parser.parse(next, this.option);
      this.data = this.data["data"];
      console.log(this.data); 

      
      this.countriesList = Array.from(new Set(this.data.map(opposition => (opposition.opposition) )))
      .filter(c=> c!=undefined).sort();

      this.countriesList.forEach(country => this.totalScore.push(this.getBattingScoreVsOpponent(country)));
      this.countriesList.forEach(country => this.centuriesCountry.push(this.getCenturies(country,"100")));
      this.countriesList.forEach(country => this.halfCenturiesCountry.push(this.getCenturies(country,"50")));
      this.countriesList.forEach(country => this.winGames.push(this.getWinGames(country)));

      this.countriesList.forEach(country => this.totalCatches.push(this.getCatchesVsOpponent(country)));
      //this.countriesList.forEach(country => this.totalWickets.push(this.getWicketsVsOpponent(country)));
      
      for(let i=0;i<15;i++){
        let obj = {
          country:"",
          score:"",
          centuries: "",
          halfCenturies:"",
          matchResults:""
        };
        obj.country = this.countriesList[i];
        obj.score = this.totalScore[i];
        obj.centuries = this.centuriesCountry[i]
        obj.halfCenturies = this.halfCenturiesCountry[i]
        obj.matchResults = this.winGames[i]
        this.tabledata.push(obj);
      }
      this.totalBattingScore = this.totalScore.reduce((a,c) => a+c);
      //   this.doughnutChartLabels = this.countriesList;
      //   this.doughnutChartData = this.totalScore;
      //  console.log(this.winGames);
         this.barChartData = [{data: this.totalScore,label: 'Scores'}];
         this.barChartData2 = [{data: this.totalCatches,label: 'Catches'}];
        //  this.barChartData3 = [{data: this.totalWickets,label: 'Catches'}];
         this.barChartLabels = this.countriesList;
         this.barChartData1 = [ 
           {data: this.centuriesCountry,label: '100\'s'},
           {data: this.halfCenturiesCountry,label: '50\'s'}
         ]
    });
    

    
  }

  getWinGames(country){
    let batting_score = this.data
                        .filter(score => score.opposition === country)
                        .filter(score => score.match_result === "won");
        console.log(batting_score)
        return batting_score.length;                      
  }

  getCenturies(country,type){
      let batting_score = this.data
                              .filter(score => score.opposition === country)
                              .filter(score => parseInt(score.batting_score) > type);

      return batting_score.length;                   

  }
  getBattingScoreVsOpponent(opposition){
    let batting_score = this.data
                  .filter( score => (score.opposition === opposition))
                  .map(score => parseInt(score.batting_score))
                  .filter(score => !isNaN(score))
                  .reduce((a,c)=> a+c)
  //console.log(opposition + "-" + batting_score)
    return batting_score;
}
getCatchesVsOpponent(opposition){
  let batting_score = this.data
                .filter( score => (score.opposition === opposition))
                .map(score => parseInt(score.catches))
                .filter(score => !isNaN(score))
                .reduce((a,c)=> a+c)
//console.log(opposition + "-" + batting_score)
  return batting_score;
}

// getWicketsVsOpponent(opposition){
//   let batting_score = this.data
//                 .filter( score => (score.opposition === opposition))
//                 // .filter(score => !isNaN(score))
//                 // .map(score => parseInt(score.wickets))
                
//                 // .reduce((a,c)=> a+c)
//     console.log(opposition + "-" + batting_score)
//   return batting_score;
// }
}
