import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { Subject, combineLatest, debounceTime, takeUntil, tap } from 'rxjs';

import { MessageComponent } from '../message/message.component';
import { MessageX } from '../stt-streaming.models';
import { MESSAGE_ROLE_OBJ } from '../../../../shared/enums/message-role.enum';
import { LocaleService } from '../../../../shared/services/locale.service';
import { STTStreamingService } from '../../../../shared/services/stt-streaming.service';

@Component({
  selector: 'app-desktop-single',
  standalone: true,
  imports: [AsyncPipe, NgFor, MessageComponent],
  templateUrl: './desktop-single.component.html',
  styleUrl: './desktop-single.component.scss',
})
export class DesktopSingleComponent implements AfterViewInit, OnDestroy {
  private viewInit$ = new Subject<null>();
  private destroy$ = new Subject<null>();

  @Input() messageList: Array<MessageX> | null = [];

  @ViewChild('messageBox') messageBox?: ElementRef;
  messageBoxEl!: HTMLElement;

  locale$ = this.localeService.locale$;

  roleObj = MESSAGE_ROLE_OBJ;

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
    this.messageBoxEl = this.messageBox?.nativeElement;

    this.viewInit$.next(null);
    this.viewInit$.complete();
  }

  trackByFn(index: number, message: MessageX): string {
    return message.trackId;
  }

  scrollToLatest(): void {
    this.messageBoxEl.scrollTop = this.messageBoxEl.scrollHeight;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
