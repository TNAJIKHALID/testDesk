import { Injectable } from '@angular/core';
import {Score} from '../_model/response';
import {Test} from '../_model/test';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  public static score: Score;
  public static test: Test;
  constructor() { }

}
