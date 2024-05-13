import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { AsyncPipe, NgClass, NgFor } from '@angular/common';
import { Subject, combineLatest, debounceTime, takeUntil, tap } from 'rxjs';

// @angular/material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MessageComponent } from '../message/message.component';
import { MessageX } from '../stt-streaming.models';
import { MESSAGE_ROLE_OBJ } from '../../../../shared/enums/message-role.enum';
import { DateFnsPipe } from '../../../../shared/pipes/date-fns.pipe';
import { LocaleService } from '../../../../shared/services/locale.service';
import { STTStreamingService } from '../../../../shared/services/stt-streaming.service';

@Component({
  selector: 'app-dual-sided',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    NgFor,
    MatButtonModule,
    MatIconModule,
    MessageComponent,
    DateFnsPipe,
  ],
  templateUrl: './dual-sided.component.html',
  styleUrl: './dual-sided.component.scss',
})
export class DualSidedComponent implements AfterViewInit, OnDestroy {
  private viewInit$ = new Subject<null>();
  private destroy$ = new Subject<null>();

  @Input() messageList: Array<MessageX> | null = [];

  @ViewChildren('messageBox') messageBoxes?: QueryList<ElementRef>;
  messageBoxEls: Array<HTMLElement> = [];

  locale$ = this.localeService.locale$;

  roleObj = MESSAGE_ROLE_OBJ;

  switched = false;

  constructor(
    private STTStreamingService: STTStreamingService,
    private localeService: LocaleService
  ) {
    combineLatest([
      this.viewInit$,
      this.STTStreamingService.messageList$,
      this.STTStreamingService.toScroll$,
    ])
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(50),
        tap(() => {
          setTimeout(() => {
            this.scrollToLatest();
          });
        })
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.messageBoxEls =
      this.messageBoxes?.map((box) => box.nativeElement as HTMLElement) ?? [];

    this.viewInit$.next(null);
    this.viewInit$.complete();
  }

  trackByFn(index: number, message: MessageX): string {
    return message.trackId;
  }

  switchRole(): void {
    this.switched = !this.switched;
  }

  scrollToLatest(): void {
    this.messageBoxEls.forEach((el) => (el.scrollTop = el.scrollHeight));
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
