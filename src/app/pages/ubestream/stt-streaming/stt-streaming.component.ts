import { Component, OnDestroy } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';

//@angular/material
import { BreakpointObserver } from '@angular/cdk/layout';

import { DesktopDoubleComponent } from './desktop-double/desktop-double.component';
import { RecordingBarComponent } from './recording-bar/recording-bar.component';
import { DesktopSingleComponent } from './desktop-single/desktop-single.component';
import { MobileComponent } from './mobile/mobile.component';
import { RouteData } from './stt-streaming.models';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { MediaQuery } from '../../../shared/enums/media-query.enum';
import { MODE_OBJ, Mode } from '../../../shared/enums/mode.enum';
import { AuthService } from '../../../shared/services/auth.service';
import { RecorderService } from '../../../shared/services/recorder.service';
import { STTStreamingService } from '../../../shared/services/stt-streaming.service';

@Component({
  selector: 'app-stt-streaming',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    HeaderComponent,
    DesktopDoubleComponent,
    RecordingBarComponent,
    DesktopSingleComponent,
    MobileComponent,
  ],
  templateUrl: './stt-streaming.component.html',
  styleUrl: './stt-streaming.component.scss',
})
export class SttStreamingComponent implements OnDestroy {
  private destroy$ = new Subject<null>();

  SMQueryMatches?: boolean;
  landscapeQueryMatches?: boolean;

  messageList$ = this.STTStreamingService.messageList$;

  mode = Mode.DesktopSingle;
  modeObj = MODE_OBJ;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private authService: AuthService,
    private STTStreamingService: STTStreamingService,
    private recorderService: RecorderService
  ) {
    const { APIKey } = this.route.snapshot.data as RouteData;

    if ((APIKey ?? '').length === 0) {
      this.authService.logout();

      return;
    } else {
      this.recorderService.APIKey = APIKey;
    }

    this.breakpointObserver
      .observe([MediaQuery.SM, MediaQuery.MD, MediaQuery.Landscape])
      .pipe(
        takeUntil(this.destroy$),
        tap((result) => {
          this.SMQueryMatches = result.breakpoints[MediaQuery.SM];
          this.landscapeQueryMatches = result.breakpoints[MediaQuery.Landscape];
        }),
        tap((result) => this.onBreakpoints(result.breakpoints))
      )
      .subscribe();

    // TODO: handle param (candidates, main_lang, target_lang, log_name) change

    // TODO: test
    // this.test();
  }

  test(): void {
    const { prefix, main_lang } = this.recorderService;

    setTimeout(() => {
      this.STTStreamingService.addOrUpdate(
        {
          message_index: 1,
          language: 'zh',
          text: '你好',
          translated_text: '',
        },
        { prefix, main_lang }
      );
    }, 3000);

    setTimeout(() => {
      this.STTStreamingService.addOrUpdate(
        {
          message_index: 1,
          language: 'zh',
          text: '你好嗎？',
          translated_text: 'How are you?',
        },
        { prefix, main_lang }
      );
    }, 6000);

    setTimeout(() => {
      this.STTStreamingService.addOrUpdate(
        {
          message_index: 1,
          language: 'zh',
          text: '你好嗎...？',
          translated_text: 'How are you...?',
        },
        { prefix, main_lang }
      );
    }, 9000);

    setTimeout(() => {
      this.STTStreamingService.addOrUpdate(
        {
          message_index: 2,
          language: 'en',
          text: "I'm fine, thank you.",
          translated_text: '我很好，謝謝。',
        },
        { prefix, main_lang }
      );
    }, 12000);

    setTimeout(() => {
      this.STTStreamingService.addOrUpdate(
        {
          message_index: 3,
          language: 'zh',
          text: '今天天氣真好。',
          translated_text: "It' a beautiful day today.",
        },
        { prefix, main_lang }
      );
    }, 15000);
  }

  onBreakpoints(breakpoints: { [key: string]: boolean }) {
    const ltMD = !breakpoints[MediaQuery.MD];
    const isLandscape = breakpoints[MediaQuery.Landscape];

    let _mode: Mode = this.mode;

    switch (this.mode) {
      case Mode.DesktopSingle:
        break;
      case Mode.DesktopDouble:
        if (ltMD) {
          _mode = Mode.DesktopSingle;
        }
        break;
      case Mode.Mobile:
        if (ltMD && isLandscape) {
          _mode = Mode.DesktopSingle;
        }
        break;
    }

    this.mode = _mode;

    this.STTStreamingService.toScroll$.next(true);
  }

  onModeEmit(mode: Mode): void {
    this.mode = mode;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();

    this.recorderService.stopRecording();
  }
}
