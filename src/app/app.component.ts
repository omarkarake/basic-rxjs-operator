import { Component, OnInit } from '@angular/core';
import { concat, from, interval, Observable, of, take, throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'exploring-basic-rxjs-operator';
  numbers$: Observable<number>;
  colors$: Observable<string>;
  intervalNumbers$: Observable<number>;
  newArrayNumbers: number[] = [6, 7, 8, 9, 10];
  numbersFrom6To10$: Observable<number>;
  concatedNumbers$: Observable<number>;
  newArray: string[] = ['blue', 'yellow', 'green'];
  numbersWithError$: Observable<number>;

  constructor() {
    this.numbers$ = of(1, 2, 3, 4, 5);
    this.colors$ = from(this.newArray);
    this.numbersFrom6To10$ = from(this.newArrayNumbers);
    this.intervalNumbers$ = interval(1000);
    this.concatedNumbers$ = concat(of(1, 2, 3, 4, 5), from([6, 7, 8, 9, 10]));
    this.numbersWithError$ = new Observable<number>((observer) => {
      observer.next(1);
      observer.next(2);
      observer.error('An error occurred on number 3!');
      observer.next(4);
      observer.next(5);
    });
  }

  ngOnInit(): void {}

  fromOperator() {
    console.log('----------------------from operator--------------------');
    this.colors$.subscribe({
      next: (value) => console.log('value: ', value),
      error: (error) => console.log('error: ', error),
      complete: () =>
        console.log('the end of emmition values to: from operator'),
    });
  }
  intervalOperator() {
    console.log('----------------------interval operator---------------------');
    const takeFiveNumbers$ = this.intervalNumbers$.pipe(take(5));
    takeFiveNumbers$.subscribe({
      next: (value) => console.log('value: ', value),
      error: (error) => console.log('error: ', error),
      complete: () =>
        console.log(
          'the interval that emmit 5 numbers using take is completed'
        ),
    });
  }
  ofOperator() {
    console.log('----------------------of operator----------------------');
    this.numbers$.subscribe({
      next: (value) => console.log('next: ', value),
      error: (error) => console.log('error: ', error),
      complete: () => console.log('the end emmition of value to: of operator'),
    });
  }

  concatOperator() {
    console.log('----------------------concat operator----------------------');
    this.concatedNumbers$.subscribe({
      next: (value) => console.log('value: ', value),
      error: (error) => console.log('error: ', error),
      complete: () =>
        console.log(
          'the end of the concated map, first observable 1 to 5 and second observable is from 6 to 10'
        ),
    });
  }

  errorOperator() {
    console.log(
      '-------------when erroring in emition of values ----------------'
    );
    this.numbersWithError$.subscribe({
      next: (value) => console.log('value: ', value),
      error: (error) => console.error('error: ', error),
      complete: () => console.log('the emmition ended with error'),
    });
  }
}
