import { Component, OnInit } from '@angular/core';
import {Test} from '../../_model/test';
import {DataService} from '../../_service/data.service';
import { timer } from 'rxjs';
import {Router} from '@angular/router';
import {Question} from '../../_model/question';
import {QstResponse, Response, ResponseObject, Score} from '../../_model/response';
import {EvaluationService} from '../../_service/evaluation.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Answer} from '../../_model/answer';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  public test: Test;
  public testData;
  public onTest: boolean ;
  public currentQuestionNumber : number = 0;
  public response : Response = new Response();
  public allowNoAnswering: boolean = false;
  public allowNoPassing: boolean = false;
  public noAnswer: boolean = true;
  /**/

  checkedArray : Array<number> = new Array<number>();
  isChecked: boolean;
  score: Score = new Score();
  public  numbers : any = timer(0, 1000*60);
  public minutesLeft : number;
  public minutesPast : number;
  second: any  = timer(0, 1000);
  secondLeft: any  = timer(0, 1000);
  /**/
  question: Question;
  private noAllAnswersForFill: boolean = true;
  /***  Constructor ***/
  constructor(public dataService:DataService, public router:Router,
              public evaluationService:EvaluationService
  ) { }

  ngOnInit(): void {
    this.onTest = false;
    this.getTest();
    //this.onExample();
  }
  public strings: any;
  public a : Array<string[]> = new Array<string[]>();
  public ma : Map<number,Array<Answer>> = new Map<number, Array<Answer>>();
  public hello(){
    if(this.question.type == 'FILL'){
      for (let i = 0; i < this.question.answers.length; i++){
        let answer = this.question.answers[i];
        let order = this.question.answers[i].inOrder;
        if (this.ma.has(order) && this.ma.get(order).indexOf(answer) == -1) {
          let array = this.ma.get(order);
          array.push(answer);
          this.ma.set(order,array);
        }else {
          let array = new Array<Answer>();
          array.push(answer);
          this.ma.set(order,array);
        }
      }
      this.strings = this.question.question.split('<s>');
    }
  }
  public getTest(){
    let url = '/getTest?id=1';
    this.dataService.getData(url).subscribe(data=>{
      this.testData = data;
      this.test = this.testData;
      console.log(this.test);
      console.log(this.test.questions[1]);
      EvaluationService.test = this.test;
      this.response.testId = this.test.id;
      for (let i = 0; i < this.test.questions.length; i++){
        let question1 = this.test.questions[i];
        if(question1.type=='ORDER'){
          let array: Array<number> = new Array<number>();
          question1.answers.forEach(a =>array.push(a.id));
          this.response.responses.set(question1.id, array);
        } else this.response.responses.set(question1.id, []);
      }
    },error => {
      console.error(error);
    });
  }
  public startTimer(testTime : number) {
    this.numbers.subscribe(x => {
      console.log(x);
      this.minutesPast = x;
      this.minutesLeft = testTime - this.minutesPast;
      if(this.minutesLeft == 1){
        this.second.subscribe(x=>{
          this.secondLeft = 59 - x;
          console.log(this.secondLeft);
        })
      }
      if(this.secondLeft == 0 ) this.triggerFunction();
    });
  }
  triggerFunction() {
    console.log('Timer Ended');
    this.onSubmit();
    this.second.unsubscribe();
  }
  public onNext() {
    this.noAnswer = this.checkIfAnswered();
    if(this.noAnswer){
      this.currentQuestionNumber ++;
      this.question = this.test.questions[this.currentQuestionNumber];
      console.log(this.currentQuestionNumber +" kkkkkkkkkkk " + this.test.questions.length);
      this.checkedArray  = new Array<number>();
      this.hello();
      //this.passedOnIt.push(this.currentQuestionNumber);
    }
  }
  public onPrev() {
    this.currentQuestionNumber--;
    this.question = this.test.questions[this.currentQuestionNumber];
    this.hello();
  }
  public onStartTest() {
    this.currentQuestionNumber = 0;
    this.question = this.test.questions[this.currentQuestionNumber];
    this.onTest = true;
    this.startTimer(5);
    this.hello();
  }
  onSubmit() {
    /*Processing*/
    this.noAnswer = this.checkIfAnswered();
    if(this.noAnswer){
      let responseObject : ResponseObject = new ResponseObject();
      responseObject.testId = this.response.testId;
      let  qstReps : Array<QstResponse> = new Array<QstResponse>();
      for (let key of this.response.responses.keys()) {
        let q = new QstResponse();
        q.answerIds = this.response.responses.get(key);
        q.id = key;
        console.log(q + " ")
        qstReps.push(q);
      }
      console.log(qstReps)
      responseObject.qstResponses = qstReps;
      console.log(responseObject);
      this.dataService.postResource("/getScore",responseObject).subscribe(data=>{
        console.log(data);
        this.testData = data;
        this.score = this.testData;
        EvaluationService.score = this.score;
        EvaluationService.test = this.test;
        console.log(EvaluationService.score);
        this.router.navigateByUrl('score');
      },error => {
        console.log(error);
      });
    }

  }
  chosenAnswer(event: any, id: number, index : number) {
    if(this.question.type == 'SELECT'){
      if(this.checkedArray.indexOf(id) != -1 && event.target.checked) {
        this.checkedArray.push(id);
      }
      else if (this.checkedArray.indexOf(id) != -1 && !event.target.checked ){
        this.checkedArray.splice(this.checkedArray.indexOf(id),1);
      } else if(this.checkedArray.indexOf(id) == -1 && event.target.checked) {
        this.checkedArray.push(id);
      }
      this.response.responses.set(this.question.id, this.checkedArray);
    }
    else if(this.question.type=='CHOOSE'){
      this.response.responses.set(this.question.id, [id]);
    }
    else if(this.question.type =='ORDER') {
      let array : Array<number> = new Array();
      for (let i = 0; i < this.question.answers.length; i++){
        let a1 = this.question.answers[i];
        array.push(a1.id);
      }
      this.response.responses.set(this.question.id,array);
    }
    else if(this.question.type == 'FILL'){
      let answerId = event.target.value;
      let array : Array<number> = this.response.responses.get(this.question.id);
      if(array.length<id){
        let newArray = new Array(id+1);
        for (let i = 0; i < array.length; i++) {
          let a1 = array[i];
          newArray[i] = a1;
        }
        newArray[id] = answerId;
        array = newArray;
      }
      else {
        array[id] = answerId;
      }
      if(array.length < this.ma.size){
        console.log('hhhhhhhhhhhhhhhhh')
        this.noAllAnswersForFill = false;
      } else this.noAllAnswersForFill = true;
      /*
      let array : Array<number> = new Array();
      this.ma.forEach(answerArray => {
        array.push(answerArray[0].id);
      })
      this.response.responses.set(this.question.id,array);
      */
      this.response.responses.set(this.question.id,array);
    }
    console.log(this.response.responses);

  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.question.answers, event.previousIndex, event.currentIndex);
    console.log(this.question.answers);
    this.chosenAnswer(null,null,null);
  }
  private checkIfAnswered() {
    let b = true;
    b = (this.question.type == 'ORDER'
      || this.response.responses.get(this.question.id).length > 0 ) &&  this.noAllAnswersForFill;
    return b;
  }
  public ngClassQuestion(question:Question, index:number):string{
    let classy:string = 'step';
    if (true){
      if (index == this.currentQuestionNumber) {
        classy += ' step-active';
      } else if (this.questionIsCorrect(question) && index < this.currentQuestionNumber){
        classy += ' step-success';
      }else if (!this.questionIsCorrect(question) && index < this.currentQuestionNumber){
        classy += ' step-error';
      }
    }


    return classy;
  }
  public questionIsCorrect(question:Question):boolean{
    let numbers = this.response.responses.get(question.id);
    let isCorrect: boolean = true;
    if (question.type=='CHOOSE'){
      isCorrect =  this.correctAnswers(question)[0].correct && this.correctAnswers(question)[0].id == numbers[0];
    } else if (question.type=='SELECT'){
      this.correctAnswers(question).forEach(answer => numbers.indexOf(answer.id) == -1  ? isCorrect = false:isCorrect)
    } else if (question.type=='ORDER'){
      question.answers.forEach(answer=>{
        if (numbers[answer.inOrder-1] != answer.id) isCorrect = false;
      });
    } else if (question.type=='FILL'){
      this.correctAnswers(question).forEach(answer => numbers.indexOf(answer.id) == -1 ? isCorrect = false:isCorrect)
    }
    return isCorrect;
  }
  correctAnswers(question:Question):Array<Answer>{
    let a : Array<Answer> = new Array<Answer>();
    question.answers.forEach(answer => {if(answer.correct) a.push(answer);});
    return a;
  }
}
