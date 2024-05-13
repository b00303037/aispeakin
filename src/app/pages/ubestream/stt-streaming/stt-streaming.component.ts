import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, map, takeUntil, tap } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

//@angular/material
import {
  BreakpointObserver,
  Breakpoints,
  MediaMatcher,
} from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { DesktopDoubleComponent } from './desktop-double/desktop-double.component';
import { DesktopSingleComponent } from './desktop-single/desktop-single.component';
import { MessageO, RouteData } from './stt-streaming.models';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { MODE_OBJ, Mode } from '../../../shared/enums/mode.enum';
import { DateFnsPipe } from '../../../shared/pipes/date-fns.pipe';
import { AuthService } from '../../../shared/services/auth.service';
import { RecorderService } from '../../../shared/services/recorder.service';
import { STTStreamingService } from '../../../shared/services/stt-streaming.service';

@Component({
  selector: 'app-stt-streaming',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgFor,
    NgClass,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    HeaderComponent,
    DesktopDoubleComponent,
    DesktopSingleComponent,
    DateFnsPipe,
  ],
  templateUrl: './stt-streaming.component.html',
  styleUrl: './stt-streaming.component.scss',
})
export class SttStreamingComponent implements OnDestroy {
  private destroy$ = new Subject<null>();
  private _SMQueryListener = () => this.changeDetectorRef.detectChanges();
  private _MDQueryListener = () => this.changeDetectorRef.detectChanges();

  SMQuery: MediaQueryList = this.media.matchMedia('(min-width: 600px)');
  MDQuery: MediaQueryList = this.media.matchMedia('(min-width: 960px)');

  messageList$ = this.STTStreamingService.messageList$;

  mode?: Mode;
  modeObj = MODE_OBJ;

  // TODO: icons for modes
  // crop_square, tv_signin
  // splitscreen, safety_divider
  // smartphone
  modeMenuItemList = [
    {
      label: 'MODE.DESKTOP_SINGLE',
      value: Mode.DesktopSingle,
      icon: 'crop_square',
    },
    {
      label: 'MODE.DESKTOP_DOUBLE',
      value: Mode.DesktopDouble,
      icon: 'splitscreen',
    },
    {
      label: 'MODE.MOBILE',
      value: Mode.Mobile,
      icon: 'smartphone',
    },
  ];

  recording = false;
  dateFnsFormatStr = 'PPpp';

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private authService: AuthService,
    private STTStreamingService: STTStreamingService,
    private recorderService: RecorderService
  ) {
    this.SMQuery.addEventListener('change', this._SMQueryListener);
    this.MDQuery.addEventListener('change', this._MDQueryListener);

    this.breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.Medium])
      .pipe(
        takeUntil(this.destroy$),
        tap((result) => this.onBreakpoints(result.breakpoints))
      )
      .subscribe();

    const { APIKey } = this.route.snapshot.data as RouteData;

    if ((APIKey ?? '').length === 0) {
      this.authService.logout();

      return;
    } else {
      this.recorderService.APIKey = APIKey;
    }

    // TODO: handle param (candidates, main_lang, target_lang, log_name) change

    this.recorderService.recording$
      .pipe(
        takeUntil(this.destroy$),
        tap((recording) => (this.recording = recording))
      )
      .subscribe();

    this.STTStreamingService.messageList$
      .pipe(
        tap(() => {
          // TODO: scroll to bottom
        })
      )
      .subscribe();

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
  }

  onBreakpoints(breakpoints: { [key: string]: boolean }) {
    const ltSM = !breakpoints[Breakpoints.Small];
    const ltMD = !breakpoints[Breakpoints.Medium];

    if (ltSM) {
      if (this.mode !== Mode.DesktopSingle) {
        this.mode = Mode.DesktopSingle;
      }
    } else if (ltMD) {
      if (this.mode === Mode.DesktopDouble) {
        this.mode = Mode.DesktopSingle;
      }
    }
  }

  onSelectMode(mode: Mode): void {
    this.mode = mode;
  }

  onStartRecording(): void {
    this.recorderService.startRecording(this.handleText.bind(this));
  }

  onStopRecording(): void {
    this.recorderService.stopRecording();
  }

  handleText(text: string): void {
    try {
      const messageO: MessageO = JSON.parse(text);

      console.log(new Date());
      console.log(messageO);
      console.log('---');

      const { prefix, main_lang } = this.recorderService;

      this.STTStreamingService.addOrUpdate(messageO, { prefix, main_lang });
    } catch (error) {
      console.error(error);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();

    this.SMQuery.removeEventListener('change', this._SMQueryListener);
    this.MDQuery.removeEventListener('change', this._MDQueryListener);

    this.recorderService.stopRecording();
  }
}
