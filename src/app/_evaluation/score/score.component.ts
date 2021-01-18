import { Component, OnInit } from '@angular/core';
import {Score} from '../../_model/response';
import {Test} from '../../_model/test';
import {Question} from '../../_model/question';
import {EvaluationService} from '../../_service/evaluation.service';
import {AuthenticationService} from '../../_service/authentication.service';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit {
  public score: Score = new Score();
  panelOpenState = false;
  public test: Test;
  public dataTable: Question[]; // this.test.questions;
  public config: any;

  constructor(public auth:AuthenticationService) {
    this.score = EvaluationService.score;
    this.test = EvaluationService.test;
    this.dataTable = this.test.questions;
    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: EvaluationService.test.questions.length
    };
  }

  pageChanged(event){
    this.config.currentPage = event;
  }

  ngOnInit(): void {
  }

  onDownload() {

  }
}
