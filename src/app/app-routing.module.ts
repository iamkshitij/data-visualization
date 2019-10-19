import { YearComponent } from './View/year/year.component';
import { ResultsComponent } from './View/results/results.component';
import { GroundComponent } from './View/ground/ground.component';
import { InningsComponent } from './View/innings/innings.component';
import { OpponentsComponent } from './View/opponents/opponents.component';
import { SummaryComponent } from './View/summary/summary.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'summary', component: SummaryComponent },
  { path: 'opponents', component: OpponentsComponent},
  { path: 'innings', component: InningsComponent},
  { path: 'ground', component: GroundComponent},
  { path: 'results', component: ResultsComponent},
  { path: 'year', component: YearComponent},
  { path: '', component: SummaryComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
export const routingComponents = [SummaryComponent, OpponentsComponent, InningsComponent, GroundComponent, ResultsComponent, YearComponent];