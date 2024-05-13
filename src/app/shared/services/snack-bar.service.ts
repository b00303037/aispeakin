import { EventEmitter, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, tap } from 'rxjs';

import { SnackBarComponent } from '../components/snack-bar/snack-bar.component';
import { Snack, SnackBarData } from '../components/snack-bar/snack-bar.models';
import { SnackType } from '../enums/snack-type.enum';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  private snackSource$ = new EventEmitter<void>();
  private snackQueue: Array<Snack> = [];
  private intervalMS = 2000;

  constructor(private matSnackBar: MatSnackBar) {
    this.snackSource$
      .pipe(
        filter(() => this.snackQueue.length !== 0),
        tap(() => {
          const snack = this.snackQueue.shift();

          if (snack) {
            const data: SnackBarData = snack;

            this.matSnackBar
              .openFromComponent(SnackBarComponent, {
                data,
                panelClass: data.type ?? undefined,
                duration: this.intervalMS,
                horizontalPosition: 'center',
                verticalPosition: 'top',
              })
              .afterDismissed()
              .subscribe(() => {
                this.snackSource$.next();
              });
          }
        })
      )
      .subscribe();
  }

  add(data: { message: string; type?: SnackType }): void {
    this.snackQueue.push(new Snack({ ...data }));

    this.snackSource$.next();
  }
}
