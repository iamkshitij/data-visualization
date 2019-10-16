import { Component, OnInit } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import { Papa } from 'ngx-papaparse';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  pathOfCsv = "/assets/sachin.csv";
  config = {
    header: true,
  };  
  data: any;
  response: any;

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  //public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartLabels;
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];

  constructor(private parser : Papa,private http: HttpClient) { }

  ngOnInit() {
          this.http.get(this.pathOfCsv,{responseType:'text'}).subscribe(next =>{
            this.data = this.parser.parse(next,this.config);
            this.data = this.data["data"];
            let totalScore = [];
            
            
            let countries = Array.from(new Set(this.data.map(opposition => (opposition.opposition) )))
                                  .filter(c=> c!=undefined);
            countries.forEach(country => totalScore.push(this.getBattingScoreVsOpponent(country)));

            const opponentBattingScore = totalScore.reduce((a,c)=>a+c);
            console.log(opponentBattingScore);
            console.log(countries);
            let winBattingScore = this.getBattingScoreVsMatchResult("won");
            let lostbattingScore = this.getBattingScoreVsMatchResult("lost");

            let firstInningScore = this.getBattingScoreVsInnings("1st");      
            let secondInningScore = this.getBattingScoreVsInnings("2nd");      
            
            let distinctGround = Array.from(new Set(this.data.map(venue => (venue.ground) )))
                                  .filter(c=> c!=undefined);
            
            distinctGround.forEach(venue => (this.getBattingScoreVsGround(venue)));
          

            let year = [];
            let dYear = [];
            this.getBattingScoreVsDate().forEach(ele => year.push(parseInt(ele.substr(ele.length-4))));
            let distinctYear = new Set();
            year.forEach(year => distinctYear.add(year));
            distinctYear.forEach(e => dYear.push(e));
            this.barChartLabels = dYear;
            console.log(dYear)
            this.getBattingScoreVsYear(1990);
          });   
  }

        getBattingScoreVsYear(year){
          let batting_score = this.data
                //.filter( score => (score.date.includes(year)))
                .map(score => parseInt(score.batting_score))
                .filter(score => !isNaN(score))
                
             // console.log(batting_score)
            return batting_score;
} 
        getBattingScoreVsDate(){
              let batting_score = this.data
               .map(score => (score.date))
               .filter(ele => ele != undefined)

          return batting_score;
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

    getBattingScoreVsGround(ground){
      let batting_score = this.data
                              .filter( score => (score.ground === ground))
                              .map(score => parseInt(score.batting_score))
                              .filter(score => !isNaN(score))
                              
        //console.log(ground + "-" + batting_score)
        return batting_score;
    }
    getBattingScoreVsMatchResult(result){
        let batting_score = this.data
                                .filter( score => score.match_result == result)
                                .map(score => parseInt(score.batting_score))
                                .filter(score => !isNaN(score))
                                .reduce((a,c)=> a+c)
                                ;
    //    console.log(batting_score);                                
        return batting_score;
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

}
