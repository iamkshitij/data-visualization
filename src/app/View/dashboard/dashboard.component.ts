import { Component, OnInit } from '@angular/core';
import { CsvService } from './../../Data/csv.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  constructor(private csvService: CsvService) { }

  ngOnInit() {
    //let data = this.csvService.getCsvData().subscribe(  result => console.log(this.parser.parse(result,this.config)));
    let resultArray = this.csvService.getCsvData();
    console.log(resultArray);
  }

}
