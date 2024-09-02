import { Component, OnInit } from '@angular/core';
import { from, interval, Observable, of, take } from 'rxjs';

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
  newArray: string[] = ['blue', 'yellow', 'green'];

  constructor() {
    this.numbers$ = of(1, 2, 3, 4, 5);
    this.colors$ = from(this.newArray);
    this.intervalNumbers$ = interval(1000);
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
}
