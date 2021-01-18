import {Answer} from './answer';

export class Question{
  id: number;
  question: string;
  type: string;
  explication: string;
  image: string;
  point: number;
  answers : Array<Answer> = new Array();
}
