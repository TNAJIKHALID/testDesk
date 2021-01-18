import { Component, OnInit } from '@angular/core';
import {DataService} from '../../_service/data.service';
import {CdkDrag, CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Question} from '../../_model/question';
export interface zone{
  id: number;
  value: string;
  name: string;
  color: string;
}

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  public question: Question;
  dataQ :any;
  zones: Array<string[]> = new Array<string[]>();
  zonesMap : Map<number,string[]> = new Map<number, string[]>();
  zoneValues : Array<string>;
  colors: Array<string>;
  public names : Array<string>;
  connected : Array<string> = new Array();
  connectedAllToZ : Array<string> = new Array();
  public zs :zone[];

/**/correctOnlyIds: Array<number> = new Array<number>();

  init(){
    this.zoneValues = new Array();
    this.names = new Array();
    this.colors = new Array();
    this.zs = new Array(this.question.answers.length);
    for (let i = 0; i < this.question.answers.length; i++){
      let answer = this.question.answers[i];
      let strings = answer.answer.split("/");
      let zon : zone = {id:answer.id,
          value:strings[0],
          name:strings[1]=='#' ? 'zone '+i:strings[1],
          color: strings[2]=='#' ? 'bluegrey':strings[2]
      };
      this.zs.push(zon);
    }
    console.log(this.zs)
    this.zs.forEach(z=>{
      this.colors.push(z.color);
      this.names.push(z.name);
      this.zoneValues.push(z.value);
    });
    this.intiArrays();
    this.zoneValues = this.shuffle(this.zoneValues);
  }

  constructor(public dataService:DataService) {
    this.dataService.getData('/getQuestion?id=39').subscribe(data=>{
      this.dataQ = data;
      this.question = this.dataQ;
      console.log(this.question);
      this.intiArrays();
      this.init();
    },error => {
      console.log(error);
    });
  }

  ngOnInit(): void {
    this.dataService.getData('/getQuestion?id=39').subscribe(data=>{
      this.dataQ = data;
      this.question = this.dataQ;
      console.log(this.question);
      this.init();
    },error => {
      console.log(error);
    });

  }

  private intiArrays() {
    this.zones = new Array<string[]>(this.zoneValues.length);
    this.zonesMap = new Map<number, string[]>();
    for (let i = 0; i < this.zones.length; i++){
      this.zones[i] = new Array();
      this.zones[i].push();
      this.connectedAllToZ.push(''+i);
      this.connected.push(''+i);

      let a : Array<string> = new Array<string>(1);
      this.zonesMap.set(i,a);
    }
    this.connectedAllToZ.push('all');
  }

  drop(event: CdkDragDrop<string[]>) {
    let id = event.container.id;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else if (  id == 'all' ){
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    } else if ( /* this.zones[id].length <= 0*/ this.zonesMap.get(Number(id)).length <=1 ){
      console.log(this.zones[id].length <= 0);
      console.log('id ' + id);
      console.log('color at id ' + this.colors[id]);
      console.log(this.zones[id]);
      this.question.answers.forEach(answer=>{
        let a = answer.answer;
        console.log(a +'///origin');
        if(a.split('/')[0] == this.zones[id][0]
          && (a.split('/')[1] == this.names[id] || a.split('/')[2] == this.colors[id])){
          this.correctOnlyIds.push(answer.id);
        }
      });
      console.log('is Correct hhhhhhhhhhhhhhhhh');
      console.log(this.correctOnlyIds )
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  /** Predicate function that only allows even numbers to be dropped into a list. */
  evenPredicate(item: CdkDrag<string>) {
    return true;
  }

  /** Predicate function that doesn't allow items to be dropped into a list. */
  noReturnPredicate() {
    return true;
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
}






/*
 drop(event: CdkDragDrop<string[]>) {
    let id = event.container.id;
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else if (  id == 'all' ){
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    } else if (  this.zones[id].length <= 0 ){
      console.log(id + '  jjjj');
      console.log(this.zones[id].length <= 0);
      console.log(this.zones[id]);
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }


this.even = new Array();
    this.even.push();
    this.evend = new Array();
    this.evend.push();
    this.evendd = new Array();
    this.evendd.push();
 */
/*

  all =['Zone de voisinage simple',
    'Zone de voisinage renforcé en haute tension',
    'Zone des travaux sous tension en haute tension'];// [6, 7, 8, 9,4,2,1];
  even : Array<string> ;//= [10];
  evend : Array<string> ;//= [10];
  evendd : Array<string> ;//= [10];
 */


/*
if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
 */
