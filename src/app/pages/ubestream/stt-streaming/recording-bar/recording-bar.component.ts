import {
  Component,
  EventEmitter,
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
import { SurveyLinkDialogComponent } from '../../../../shared/components/survey-link-dialog/survey-link-dialog.component';
import { RLANG_OPTION_LIST, RLang } from '../../../../shared/enums/r-lang.enum';
import { MediaQuery } from '../../../../shared/enums/media-query.enum';
import { MODE_OBJ, Mode } from '../../../../shared/enums/mode.enum';
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

  @Input() mode!: Mode;
  @Input() main = true;
  @Output() modeEmit = new EventEmitter<Mode>();

  MDQueryMatches?: boolean;
  landscapeQueryMatches?: boolean;

  messageList$ = this.STTStreamingService.messageList$;

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

  recording = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,
    private streamServerService: AbstractStreamServerService,
    private STTStreamingService: STTStreamingService,
    public recorderService: RecorderService
  ) {
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

    this.recorderService.recording$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        tap((recording) => (this.recording = recording))
      )
      .subscribe();
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

    this.onAddLog();
  }

  onStopRecording(): void {
    this.recorderService.stopRecording();

    this.openSurveyLinkDialog();
  }

  onAddLog(): void {
    this.streamServerService
      .AddLog()
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

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
