export class Response{
  public testId: number ;
  public responses : Map<number,number[]>  = new Map<number,number[]>();

  constructor() {

  }
}

export class QstResponse {
  public id: number;
  public answerIds: number[];
  constructor() {

  }
}

export class ResponseObject{
  public testId: number ;
 public qstResponses : Array<QstResponse>;
  constructor() {

  }
}

export class Score{
  id: number;
  score: number;
  validate: boolean;
  totalNumberOfCorrectAnswers: number;
  constructor() {
  }
}
