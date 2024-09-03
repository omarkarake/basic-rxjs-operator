import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  catchError,
  combineLatest,
  concat,
  debounceTime,
  delay,
  distinctUntilChanged,
  from,
  interval,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { SearchValidators } from './validators/search.validators';


// Define a type that can be either the successful data or an error
type CombinedData = 
  | { userDetails: any; userPosts: any[] } 
  | { error: string };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'exploring-basic-rxjs-operator';
  numbers$: Observable<number>;
  colors$: Observable<string>;
  intervalNumbers$: Observable<number>;
  newArrayNumbers: number[] = [6, 7, 8, 9, 10];
  numbersFrom6To10$: Observable<number>;
  concatedNumbers$: Observable<number>;
  newArray: string[] = ['blue', 'yellow', 'green'];
  numbersWithError$: Observable<number>;
  private parentSubscription: Subscription = new Subscription();
  searchForm!: FormGroup;
  isLoading: boolean = false;
  searchResults: string[] = [];
  combinedData$!: Observable<CombinedData>;

  constructor(private fb: FormBuilder) {
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
    // Simulate loading delay
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }

  get search(): FormControl {
    return this.searchForm.get('search') as FormControl;
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      search: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          SearchValidators.cannotContainSpace,
        ],
      ],
    });
    this.combineLatestExample();
  }

  combineLatestExample(): void {
    // Simulate API call for user details with potential error
    const userDetails$ = of({
      userId: 1,
      username: 'john_doe',
      email: 'john@example.com',
    }).pipe(
      delay(2000), // Simulates a 2-second delay
      // Uncomment to simulate an error
      // switchMap(() => throwError(() => new Error('Failed to fetch user details'))),
      catchError((error) => {
        console.error('Error in userDetails$', error);
        return of({ error: 'User details could not be loaded.' });
      })
    );

    // Simulate API call for user posts with potential error
    const userPosts$ = of([
      { postId: 1, content: 'Post 1' },
      { postId: 2, content: 'Post 2' },
      { postId: 3, content: 'Post 3' },
    ]).pipe(
      delay(5000), // Simulates a 5-second delay
      // Uncomment to simulate an error
      // switchMap(() => throwError(() => new Error('Failed to fetch user posts'))),
      catchError((error) => {
        console.error('Error in userPosts$', error);
        return of([{ postId: 0, content: 'Posts could not be loaded.' }]);
      })
    );

    // Use combineLatest to combine the latest emissions from both observables
    this.combinedData$ = combineLatest([userDetails$, userPosts$]).pipe(
      map(([userDetails, userPosts]) => {
        // Handle the case where an error occurred in one of the streams
        if ('error' in userDetails || userPosts[0].postId === 0) {
          return { error: 'Data could not be fully loaded. Please try again later.' };
        }
        return { userDetails, userPosts };
      }),
      catchError((error) => {
        console.error('Error in combinedData$', error);
        return of({ error: 'An unexpected error occurred. Please try again later.' });
      })
    );

    this.combinedData$.subscribe({
      next: (data) => {
        if ('error' in data) {
          console.error('Error in combinedData$', data.error);
          return;
        }
        console.log('User details:', data.userDetails);
        console.log('User posts:', data.userPosts);
      },
      error: (error) => {
        console.error('Error in combinedData$', error);
      },
      complete: () => {
        console.log('Combined data stream completed.');
      },
    });
  }

  simulateApiCall(query: string) {
    // Simulate API response with delay
    const data = [
      'Apple',
      'Banana',
      'Cherry',
      'Date',
      'Fig',
      'Grape',
      'Kiwi',
      'Lemon',
      'Mango',
      'Nectarine',
      'Orange',
      'Papaya',
      'Quince',
    ];

    const filteredData = data.filter((item) =>
      item.toLowerCase().includes(query.toLowerCase())
    );

    return of(filteredData).pipe(delay(1000)); // Simulates network delay
  }

  ngAfterViewInit(): void {
    this.search.valueChanges
      .pipe(
        debounceTime(400), // wait for the user to stop typing for 400ms
        distinctUntilChanged(), // only trigger if the current value is different than the last
        switchMap((searchTerm) => {
          this.isLoading = true; // Show loading indicator
          return this.simulateApiCall(searchTerm).pipe(
            delay(0) // Ensure the observable emits only after the loading state is set
          );
        })
      )
      .subscribe((results) => {
        this.isLoading = false; // Hide loading indicator
        this.searchResults = results;
      });
  }

  ngOnDestroy(): void {
    this.parentSubscription.unsubscribe();
  }

  fromOperator() {
    console.log('----------------------from operator--------------------');
    const sub = this.colors$.subscribe({
      next: (value) => console.log('value: ', value),
      error: (error) => console.log('error: ', error),
      complete: () =>
        console.log('the end of emmition values to: from operator'),
    });
    this.parentSubscription.add(sub);
  }
  intervalOperator() {
    console.log('----------------------interval operator---------------------');
    const takeFiveNumbers$ = this.intervalNumbers$.pipe(take(5));
    const sub = takeFiveNumbers$.subscribe({
      next: (value) => console.log('value: ', value),
      error: (error) => console.log('error: ', error),
      complete: () =>
        console.log(
          'the interval that emmit 5 numbers using take is completed'
        ),
    });
    this.parentSubscription.add(sub);
  }
  ofOperator() {
    console.log('----------------------of operator----------------------');
    const sub = this.numbers$.subscribe({
      next: (value) => console.log('next: ', value),
      error: (error) => console.log('error: ', error),
      complete: () => console.log('the end emmition of value to: of operator'),
    });
    this.parentSubscription.add(sub);
  }

  concatOperator() {
    console.log('----------------------concat operator----------------------');
    const sub = this.concatedNumbers$.subscribe({
      next: (value) => console.log('value: ', value),
      error: (error) => console.log('error: ', error),
      complete: () =>
        console.log(
          'the end of the concated map, first observable 1 to 5 and second observable is from 6 to 10'
        ),
    });
    this.parentSubscription.add(sub);
  }

  errorOperator() {
    console.log(
      '-------------when erroring in emition of values ----------------'
    );
    const sub = this.numbersWithError$.subscribe({
      next: (value) => console.log('value: ', value),
      error: (error) => console.error('error: ', error),
      complete: () => console.log('the emmition ended with error'),
    });
    this.parentSubscription.add(sub);
  }
}
