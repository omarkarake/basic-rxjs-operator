import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap, retry, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SimulateErrorUsersService {
  constructor() {}

  getUsers(): Observable<any> {
    return of(null).pipe(
      tap(() => console.log('HTTP request initiated')), // Log initial request
      delay(2000), // Simulate network latency
      switchMap(() => {
        const success = Math.random() > 0.5; // Randomly decide success or failure
        if (success) {
          const users = [
            { id: 1, username: 'johndoe', email: 'johndoe@example.com' },
            { id: 2, username: 'janedoe', email: 'janedoe@example.com' },
            { id: 3, username: 'mikesmith', email: 'mike.smith@example.com' },
            {
              id: 4,
              username: 'sarahconnor',
              email: 'sarah.connor@example.com',
            },
            { id: 5, username: 'brucewayne', email: 'bruce.wayne@example.com' },
            { id: 6, username: 'clarkkent', email: 'clark.kent@example.com' },
          ];
          return of(users);
        } else {
          return throwError(() => new Error('Failed to fetch user data.'));
        }
      }),
      tap({
        next: (data) => console.log('Successful response:', data), // Log successful response
        error: (error) => console.log('Error occurred:', error.message), // Log error
      }),
      retry({
        count: 3, // Retry up to 3 times
        delay: (retryCount) => {
          console.log(`Retry attempt #${retryCount}`); // Log each retry attempt
          return of(null).pipe(delay(1000)); // Add delay between retries
        },
      }),
      catchError((error) => {
        console.error('Retries exhausted:', error.message);

        // Fallback response after retries are exhausted
        const fallbackUsers = [
          {
            id: 101,
            username: 'fallbackuser1',
            email: 'fallback1@example.com',
          },
          {
            id: 102,
            username: 'fallbackuser2',
            email: 'fallback2@example.com',
          },
        ];

        // Either return fallback data or rethrow the error
        console.log('Returning fallback data'); // Log fallback response
        // return of(fallbackUsers); // Provide fallback data
        return throwError(
          () => new Error('All retries failed, fallback not available.')
        ); // Rethrow the error
      })
    );
  }
}
