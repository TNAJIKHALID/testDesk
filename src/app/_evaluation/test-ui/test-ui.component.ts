import {Component, OnInit} from '@angular/core';
import {Test} from '../../_model/test';
import {QstResponse, Response, ResponseObject, Score} from '../../_model/response';
import {timer} from 'rxjs';
import {Question} from '../../_model/question';
import {DataService} from '../../_service/data.service';
import {Router, ActivatedRoute} from '@angular/router';
import {EvaluationService} from '../../_service/evaluation.service';
import {Answer} from '../../_model/answer';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-test-ui',
  templateUrl: './test-ui.component.html',
  styleUrls: ['./test-ui.component.css']
})
export class TestUIComponent implements OnInit {
  public test: Test;
  public testData;
  public onTest: boolean;
  public currentQuestionNumber: number = 0;
  public response: Response = new Response();
  public allowNoPassing: boolean = false;
  public noAnswer: boolean = true;
  checkedArray: Array<number> = new Array<number>();
  isChecked: boolean;

  score: Score = new Score();
  public numbers: any = timer(0, 1000 * 60);
  public minutesLeft: number;
  public minutesPast: number;
  second: any = timer(0, 1000);
  secondLeft: any = timer(0, 1000);
  /**/
  question: Question;
  private allAnswersForFillChecked: boolean = true;
  public mode: string = 'Mode Entraînement';
  public onEvaluation : boolean;
  public showAnswer: boolean = false;
  /***  Constructor ***/
  constructor(public dataService: DataService, public router: Router,
              public evaluationService: EvaluationService,
              public route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.onTest = false;
    let type = this.route.snapshot.params.type;
    this.onEvaluation = type == 'true' ? true : false;
    this.getTest();
    this.mode = this.onEvaluation ? 'Mode Evaluation' : 'Mode Entrainement';
    //this.onExample();
  }

  public strings: any;
  public a: Array<string[]> = new Array<string[]>();
  public ma: Map<number, Array<Answer>> = new Map<number, Array<Answer>>();
  public hello() {
    if (this.question.type == 'FILL') {
      for (let i = 0; i < this.question.answers.length; i++) {
        let answer = this.question.answers[i];
        let order = this.question.answers[i].inOrder;
        if (this.ma.has(order) && this.ma.get(order).indexOf(answer) == -1) {
          let array = this.ma.get(order);
          array.push(answer);
          this.ma.set(order, array);
        } else {
          let array = new Array<Answer>();
          array.push(answer);
          this.ma.set(order, array);
        }
      }
      this.strings = this.question.question.split('<s>');
    }
  }

  public getTest() {
    let url = '/getTest?id=1';
    this.dataService.getData(url).subscribe(data => {
      this.testData = data;
      this.test = this.testData;
      EvaluationService.test = this.test;
      this.response.testId = this.test.id;
      for (let i = 0; i < this.test.questions.length; i++) {
        let question1 = this.test.questions[i];
        if (question1.type == 'ORDER') {
          let array: Array<number> = new Array<number>();
          question1.answers.forEach(a => array.push(a.id));
          this.response.responses.set(question1.id, array);
        } else {
          this.response.responses.set(question1.id, []);
        }
      }
    }, error => {
      console.error(error);
    });
  }

  public startTimer(testTime: number) {
    this.numbers.subscribe(x => {
      this.minutesPast = x;
      this.minutesLeft = testTime - this.minutesPast;
      if (this.minutesLeft == 1) {
        this.second.subscribe(x => {
          this.secondLeft = 59 - x;
        });
      }
      if (this.secondLeft == 0) {
        this.triggerFunction();
      }
    });
  }

  triggerFunction() {
    console.log('Timer Ended');
    this.onSubmit();
    this.second.unsubscribe();
  }

  public onNext() {
    this.noAnswer = this.checkIfAnswered();
    if (this.noAnswer) {
      this.currentQuestionNumber++;
      this.question = this.test.questions[this.currentQuestionNumber];
      this.checkedArray = new Array<number>();
      this.hello();
    };
    this.showAnswer =false;
  }

  public onPrev() {
    this.showAnswer = false;
    this.currentQuestionNumber--;
    this.noAnswer = true;
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
    if (this.noAnswer) {
      let responseObject: ResponseObject = new ResponseObject();
      responseObject.testId = this.response.testId;
      let qstReps: Array<QstResponse> = new Array<QstResponse>();
      for (let key of this.response.responses.keys()) {
        let q = new QstResponse();
        q.answerIds = this.response.responses.get(key);
        q.id = key;
        console.log(q + ' ');
        qstReps.push(q);
      }
      console.log(qstReps);
      responseObject.qstResponses = qstReps;
      console.log(responseObject);
      this.dataService.postResource('/getScore', responseObject).subscribe(data => {
        console.log(data);
        this.testData = data;
        this.score = this.testData;
        EvaluationService.score = this.score;
        EvaluationService.test = this.test;
        this.router.navigateByUrl('score');
      }, error => {
        console.log(error);
      });
    }

  }

  chosenAnswer(event: any, id: number, index: number) {
    if (this.question.type == 'SELECT') {
      if (this.checkedArray.indexOf(id) != -1 && event.target.checked) {
        this.checkedArray.push(id);
      } else if (this.checkedArray.indexOf(id) != -1 && !event.target.checked) {
        this.checkedArray.splice(this.checkedArray.indexOf(id), 1);
      } else if (this.checkedArray.indexOf(id) == -1 && event.target.checked) {
        this.checkedArray.push(id);
      }
      this.response.responses.set(this.question.id, this.checkedArray);
    } else if (this.question.type == 'CHOOSE') {
      this.response.responses.set(this.question.id, [id]);
    } else if (this.question.type == 'ORDER') {
      let array: Array<number> = new Array();
      for (let i = 0; i < this.question.answers.length; i++) {
        let a1 = this.question.answers[i];
        array.push(a1.id);
      }
      this.response.responses.set(this.question.id, array);
    } else if (this.question.type == 'FILL') {
      let answerId = event.target.value;

      let array: Array<number> = this.response.responses.get(this.question.id);
      if (array.length < id) {
        let newArray = new Array(id + 1);
        for (let i = 0; i < array.length; i++) {
          let a1 = array[i];
          newArray[i] = a1;
        }
        newArray[id] = answerId;
        array = newArray;
      } else {
        array[id] = answerId;
      }
      if (array.length < this.ma.size) {
        this.allAnswersForFillChecked = false;
      } else {
        this.allAnswersForFillChecked = true;
      }
      this.response.responses.set(this.question.id, array);
    }
    console.log(this.response.responses);

  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.question.answers, event.previousIndex, event.currentIndex);
    this.chosenAnswer(null, null, null);
  }

  private checkIfAnswered() {
    let b = true;
    if(this.question.type == 'FILL') {
      let numbers1 = this.response.responses.get(this.question.id);
      this.allAnswersForFillChecked = !numbers1.includes(undefined) && numbers1.length == this.ma.size ;
      console.log(this.response.responses.get(this.question.id))
      console.log('size should be : ' + this.ma.size);
      console.log('size now ' + numbers1.length)
      console.log( 'includes  ' + this.response.responses.get(this.question.id).includes(undefined));
      console.log(this.allAnswersForFillChecked);
    }
    b = (this.question.type == 'ORDER'
      || this.response.responses.get(this.question.id).length > 0) && this.allAnswersForFillChecked;
    return b;
  }

  public ngClassQuestion(question: Question, index: number): string {
    let classy: string = 'step';
    if (true) {
      if (index == this.currentQuestionNumber) {
        classy += ' step-active';
      } else if (this.questionIsCorrect(question) && index < this.currentQuestionNumber) {
        classy += ' step-success';
      } else if (!this.questionIsCorrect(question) && index < this.currentQuestionNumber) {
        classy += ' step-error';
      }
    }


    return classy;
  }

  public questionIsCorrect(question: Question): boolean {
    let numbers = this.response.responses.get(question.id);
    let isCorrect: boolean = true;
    if (question.type == 'CHOOSE') {
      isCorrect = this.correctAnswers(question)[0].correct && this.correctAnswers(question)[0].id == numbers[0];
    }
    else if (question.type == 'SELECT') {
      this.correctAnswers(question).forEach(answer => numbers.indexOf(answer.id) == -1 ? isCorrect = false : isCorrect);
    }
    else if (question.type == 'ORDER') {
      question.answers.forEach(answer => {
        if (numbers[answer.inOrder - 1] != answer.id) {
          isCorrect = false;
        }
      });
    }
    else if (question.type == 'FILL') {
      this.correctAnswers(question).forEach(answer =>
        numbers.indexOf(answer.id) == -1 ? isCorrect = false : isCorrect);
    }
    return isCorrect;
  }

  correctAnswers(question: Question): Array<Answer> {
    let a: Array<Answer> = new Array<Answer>();
    question.answers.forEach(answer => {
      if (answer.correct) {
        a.push(answer);
      }
    });
    return a;
  }

  onShowAnswer() {
    this.showAnswer = true;
    let type = this.question.type;
    if(type == 'SELECT' || type == 'CHOOSE'){
      let resps : Array<number> = new Array<number>();
      this.correctAnswers(this.question).forEach(a =>resps.push(a.id))
      this.response.responses.set(this.question.id,resps);
    }
    else if(type == 'ORDER'){
      let resps : Array<number> = new Array<number>();
      let answers : Array<Answer> = this.question.answers;
      answers.sort((a,b) => a.inOrder > b.inOrder ? 1: -1);
      answers.forEach(a =>resps.push(a.id))
      this.response.responses.set(this.question.id,resps);
    }
    else if (type == 'FILL'){
      let answers : Array<Answer> = this.correctAnswers(this.question);
      let resps : Array<number> = new Array<number>(answers.length);
      for (let i = 0; i < answers.length; i++){
        let a1 = answers[i];
        resps[a1.inOrder]=a1.id;
      }
      this.response.responses.set(this.question.id,resps);
    }
  }
}
