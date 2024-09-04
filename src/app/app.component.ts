import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
  filter,
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

export interface UserDetails {
  userId: number;
  username: string;
  email: string;
  error?: string; // Optional field to handle errors in user details
}

export interface UserPost {
  postId: number;
  title: string;
  content: string;
  image: string;
}

export type CombinedData =
  | { userDetails: UserDetails; userPosts: UserPost[] }
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
  searchResults!: UserPost[];
  userResults: UserDetails[] = [];
  combinedData$!: Observable<CombinedData>;
  datas!: UserPost[];
  errorMessage: string = '';

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
          // SearchValidators.cannotContainSpace,
        ],
      ],
    });
    this.combineLatestExample();
  }

  combineLatestExample(): void {
    this.isLoading = true;

    // Simulate API call for user details with potential error
    const userDetails$: Observable<UserDetails> = of({
      userId: 1,
      username: 'john_doe',
      email: 'john@example.com',
    }).pipe(
      delay(2000),
      // Uncomment the next line to simulate an error in user details API
      // switchMap(() => throwError('Failed to fetch user details')),
      catchError((error) => {
        console.error('Error in userDetails$', error);
        return of({
          error: 'User details could not be loaded.',
        } as UserDetails);
      })
    );

    // Simulate API call for user posts with potential error
    const userPosts$: Observable<UserPost[]> = of([
      {
        postId: 1,
        title: 'Exploring the Mountains',
        content:
          'A thrilling adventure through the rocky mountains, capturing the essence of nature.',
        image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
      },
      {
        postId: 2,
        title: 'The Art of Minimalism',
        content:
          'Understanding how minimalism can change your life and bring more clarity.',
        image:
          'https://www.graygroupintl.com/hubfs/Gray%20Group%20International/GGI%20-%20Assign%20and%20Sort%20%28WebP%29/Minimalist%20Art%20The%20Art%20of%20Subtracting.webp',
      },
      {
        postId: 3,
        title: 'Culinary Wonders',
        content:
          'Exploring the world’s best dishes and the stories behind them.',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445',
      },
      {
        postId: 4,
        title: 'Tech Innovations 2024',
        content:
          'A look at the most groundbreaking tech advancements expected in 2024.',
        image:
          'https://imageio.forbes.com/specials-images/imageserve/64feb1e9622d5f528e73b638/0x0.jpg?format=jpg&height=900&width=1600&fit=bounds',
      },
      {
        postId: 5,
        title: 'Urban Jungle',
        content:
          'How cities are transforming into green paradises with urban farming.',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac',
      },
      {
        postId: 6,
        title: 'The Future of AI',
        content:
          'Exploring how artificial intelligence is reshaping industries and our lives.',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
      },
      {
        postId: 7,
        title: 'Traveling on a Budget',
        content:
          'Top tips and destinations for those looking to explore the world without breaking the bank.',
        image: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
      },
      {
        postId: 8,
        title: 'Sustainable Fashion',
        content:
          'How the fashion industry is embracing sustainability and what it means for consumers.',
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c',
      },
      {
        postId: 9,
        title: 'Mindfulness and Meditation',
        content:
          'The benefits of mindfulness practices and how to incorporate them into your daily routine.',
        image: 'https://images.unsplash.com/photo-1514996937319-344454492b37',
      },
      {
        postId: 10,
        title: 'The Gig Economy',
        content:
          'Understanding the rise of the gig economy and its impact on the workforce.',
        image: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d',
      },
    ]).pipe(
      delay(3000),
      // Uncomment the next line to simulate an error in user posts API
      // switchMap(() => throwError('Failed to fetch user posts')),
      catchError((error) => {
        // console.error('Error in userPosts$', error);
        return of([
          { postId: 0, content: 'Posts could not be loaded.' } as UserPost,
        ]);
      })
    );

    // Use combineLatest to combine the latest emissions from both observables
    this.combinedData$ = combineLatest([userDetails$, userPosts$]).pipe(
      map(([userDetails, userPosts]) => {
        if ('error' in userDetails || userPosts[0].postId === 0) {
          return {
            error: 'Data could not be fully loaded. Please try again later.',
          };
        }
        this.isLoading = false;
        return { userDetails, userPosts };
      }),
      catchError((error) => {
        // console.error('Error in combinedData$', error);
        return of({
          error: 'An unexpected error occurred. Please try again later.',
        });
      }),
      map((result) => {
        this.isLoading = false;
        return result;
      })
    );

    this.combinedData$.subscribe({
      next: (data) => {
        if ('error' in data) {
          console.error('Error in combinedData$', data.error);
          this.errorMessage += data.error;
          console.log('error message: ', this.errorMessage);
          return;
        }
        this.datas = data.userPosts;
        this.searchResults = this.datas;
        this.userResults.push(data.userDetails);
        // console.log('userResults: ', this.userResults);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error in combinedData$', error);
        this.errorMessage += error;
        console.log('error message: ', this.errorMessage);
      },
      complete: () => {
        console.log('Combined data stream completed.');
      },
    });
  }

  simulateApiCall(query: string) {
    // Simulate API response with delay

    const filteredData = this.datas.filter((item) =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );

    return of(filteredData).pipe(delay(1000)); // Simulates network delay
  }

  ngAfterViewInit(): void {
    this.search.valueChanges
      .pipe(
        debounceTime(400), // wait for the user to stop typing for 400ms
        distinctUntilChanged(), // only trigger if the current value is different than the last
        filter(() => this.search.valid || this.search.value.length === 0), // only proceed if the search is valid
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
