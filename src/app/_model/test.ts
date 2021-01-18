import {Question} from './question';

export class Test{
  id: number;
  testName: string;
  type: string;
  time: string;
  admissionBarrier: number;
  questions : Array<Question> = new Array<Question>();
}
