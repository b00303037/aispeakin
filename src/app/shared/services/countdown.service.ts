import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  EMPTY,
  distinctUntilChanged,
  interval,
  map,
  of,
  scan,
  startWith,
  switchMap,
  takeWhile,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountdownService {
  private _countdownSeconds = 10;

  status$ = new BehaviorSubject({
    state: 'paused',
    value: this._countdownSeconds,
  });
  ticker$ = interval(1000).pipe(map(() => -1));
  countdown$ = this.status$.pipe(
    switchMap(({ state, value }) => {
      if (state === 'paused' && value === 0) {
        return of(0);
      }

      return state === 'running'
        ? this.ticker$.pipe(
            scan((acc, curr) => acc + curr, value),
            startWith(value),
            takeWhile((val) => val >= 0),
            tap((val) => {
              if (val <= 0) {
                this.status$.next({ state: 'paused', value: 0 });
              }
            })
          )
        : EMPTY;
    }),
    distinctUntilChanged(),
    map((val) => (val < 0 ? 0 : val))
  );

  constructor() {
    this.countdown$.subscribe((remainingSeconds) => {
      const { state } = this.status$.getValue();

      this.status$.next({ state, value: remainingSeconds });
    });
  }

  start(): void {
    console.log('--- start() ---');

    const { state, value } = this.status$.getValue();

    if (value > 0 && state !== 'running') {
      this.status$.next({ state: 'running', value });
    }
  }

  pause(): void {
    console.log('--- pause() ---');

    const { value } = this.status$.getValue();

    this.status$.next({ state: 'paused', value });
  }

  reset(seconds?: number): void {
    let value: number | undefined;

    if (seconds === undefined) {
      value = this._countdownSeconds;
    } else if (seconds >= 0 && seconds <= this._countdownSeconds) {
      value = seconds;
    }

    if (value !== undefined) {
      this.status$.next({ state: 'paused', value });

      console.log(`--- reset(${value}) ---`);
    }
  }
}
