import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  distinctUntilChanged,
  map,
  skip,
  takeUntil,
  tap,
} from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

// @angular/material
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MessageO } from '../stt-streaming.models';
import { AbstractStreamServerService } from '../../../../api/abstract/abstract-stream-server.service';
import { BaseAPIResModel } from '../../../../api/models/base-api.models';
import { AddLogReq } from '../../../../api/models/stream-server/add-log.models';
import { SurveyLinkDialogComponent } from '../../../../shared/components/survey-link-dialog/survey-link-dialog.component';
import { RLANG_OPTION_LIST, RLang } from '../../../../shared/enums/r-lang.enum';
import { MediaQuery } from '../../../../shared/enums/media-query.enum';
import { MODE_OBJ, Mode } from '../../../../shared/enums/mode.enum';
import { AuthService } from '../../../../shared/services/auth.service';
import { CountdownService } from '../../../../shared/services/countdown.service';
import { RecorderService } from '../../../../shared/services/recorder.service';
import { STTStreamingService } from '../../../../shared/services/stt-streaming.service';
import { i18nSelectMapGenerator } from '../../../../shared/services/utils';

@Component({
  selector: 'app-recording-bar',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgFor,
    NgClass,
    TranslateModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
  ],
  templateUrl: './recording-bar.component.html',
  styleUrl: './recording-bar.component.scss',
})
export class RecordingBarComponent implements OnDestroy {
  private destroy$ = new Subject<null>();

  main = true;
  @Input() mode!: Mode;
  @Output() modeEmit = new EventEmitter<Mode>();

  MDQueryMatches?: boolean;
  landscapeQueryMatches?: boolean;

  messageList$ = this.STTStreamingService.messageList$;
  remaining$ = this.countdownService.status$.pipe(
    map((status) => this.formatTime(status.value))
  );

  modeObj = MODE_OBJ;
  modeMenuItemList = [
    {
      label: 'MODE.SINGLE_SIDED',
      value: Mode.SingleSided,
      icon: 'crop_square',
    },
    {
      label: 'MODE.DUAL_SIDED',
      value: Mode.DualSided,
      icon: 'splitscreen',
    },
    {
      label: 'MODE.FACE_TO_FACE',
      value: Mode.FaceToFace,
      icon: 'splitscreen',
    },
  ];
  RLangOptionList = RLANG_OPTION_LIST;
  RLangNameMap = i18nSelectMapGenerator(RLANG_OPTION_LIST, 'value', 'label');

  counting = false;
  recording = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private streamServerService: AbstractStreamServerService,
    private authService: AuthService,
    private countdownService: CountdownService,
    private STTStreamingService: STTStreamingService,
    public recorderService: RecorderService
  ) {
    this.initCounting();
    this.loadUsageObj();

    this.breakpointObserver
      .observe([MediaQuery.MD, MediaQuery.Landscape])
      .pipe(
        takeUntil(this.destroy$),
        tap((result) => {
          this.MDQueryMatches = result.breakpoints[MediaQuery.MD];
          this.landscapeQueryMatches = result.breakpoints[MediaQuery.Landscape];
        })
      )
      .subscribe();

    this.countdownService.status$
      .pipe(
        takeUntil(this.destroy$),
        map(({ value }) => value),
        distinctUntilChanged(),
        tap((value) => {
          if (value === 0) {
            this.onStopRecording();
          }
        })
      )
      .subscribe();

    this.recorderService.recording$
      .pipe(
        takeUntil(this.destroy$),
        skip(1),
        distinctUntilChanged(),
        tap((recording) => (this.recording = recording)),
        tap((recording) => this.onAddLog(recording ? 'start' : 'end')),
        tap((recording) => {
          if (this.counting) {
            this.countdownService[recording ? 'start' : 'pause']();
          }
        })
      )
      .subscribe();
  }

  initCounting(): void {
    console.log('--- initCounting ---');

    const adminList = [...Array(20)].map(
      (v, i) => `ubestream${String(i + 1).padStart(2, '0')}@ubestream.com`
    );
    const sub = this.authService.payload$.getValue()?.sub;

    this.counting = sub === undefined || !adminList.includes(sub);

    console.log('帳號:', sub);
    console.log('限制使用時間:', this.counting);
  }

  onSelectMode(mode: Mode): void {
    this.modeEmit.emit(mode);
  }

  onSelectMainLang(main_lang: RLang): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { main_lang },
      queryParamsHandling: 'merge',
    });
  }

  onStartRecording(): void {
    this.recorderService.startRecording(this.handleText.bind(this));
  }

  onStopRecording(): void {
    this.recorderService.stopRecording();

    this.openSurveyLinkDialog();
  }

  onAddLog(type: string): void {
    const req: AddLogReq = { type };

    this.streamServerService
      .AddLog(req)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => this.onError(err))
      )
      .subscribe();
  }

  openSurveyLinkDialog(): void {
    this.matDialog.open(SurveyLinkDialogComponent, {
      autoFocus: false,
      backdropClass: 'bg-black',
      disableClose: true,
      enterAnimationDuration: 250,
      exitAnimationDuration: 250,
    });
  }

  handleText(text: string): void {
    try {
      let messageOList: Array<MessageO> = [];
      let data: MessageO | Array<MessageO> = JSON.parse(text);

      messageOList = Array.isArray(data) ? [...data] : [data];

      const { prefix, main_lang } = this.recorderService;

      messageOList.forEach((messageO) => {
        this.STTStreamingService.addOrUpdate(messageO, { prefix, main_lang });
      });
    } catch (error) {
      console.error(error);
    }
  }

  onClearConversation(): void {
    this.STTStreamingService.clear();
  }

  onError(err: BaseAPIResModel<null>): Observable<never> {
    console.error(err);

    return EMPTY;
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  loadUsageObj(): void {
    console.log('--- loadUsageObj ---');

    const sub = this.authService.payload$.getValue()?.sub;
    const obj = this.getUsageObj();

    const seconds = sub !== undefined ? obj[sub] : undefined;

    console.log('帳號:', sub);
    console.log('限時:', seconds);

    this.countdownService.reset(seconds);
  }

  saveUsageObj(): void {
    console.log('--- saveUsageObj ---');

    const sub = this.authService.payload$.getValue()?.sub;

    if (sub !== undefined) {
      const obj = this.getUsageObj();
      const { value } = this.countdownService.status$.getValue();

      obj[sub] = value;

      console.log('帳號:', sub);
      console.log('限時:', value);

      this.setUsageObj(obj);
    }
  }

  getUsageObj(): {
    [key: string]: number;
  } {
    return JSON.parse(localStorage.getItem('stt-streaming-usage') ?? '{}');
  }

  setUsageObj(obj: { [key: string]: number }): void {
    localStorage.setItem('stt-streaming-usage', JSON.stringify(obj));
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();

    this.saveUsageObj();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeWindowUnload(event: BeforeUnloadEvent): void {
    if (this.counting) {
      this.saveUsageObj();

      event.preventDefault();
    }
  }
}
