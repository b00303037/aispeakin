import { Component, OnDestroy } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';

//@angular/material
import { BreakpointObserver } from '@angular/cdk/layout';

import { DualSidedComponent } from './dual-sided/dual-sided.component';
import { FaceToFaceComponent } from './face-to-face/face-to-face.component';
import { RecordingBarComponent } from './recording-bar/recording-bar.component';
import { SingleSidedComponent } from './single-sided/single-sided.component';
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
    DualSidedComponent,
    FaceToFaceComponent,
    RecordingBarComponent,
    SingleSidedComponent,
  ],
  templateUrl: './stt-streaming.component.html',
  styleUrl: './stt-streaming.component.scss',
})
export class SttStreamingComponent implements OnDestroy {
  private destroy$ = new Subject<null>();

  SMQueryMatches?: boolean;
  landscapeQueryMatches?: boolean;

  messageList$ = this.STTStreamingService.messageList$;

  queryParamKeys = [
    'candidates',
    'main_lang',
    'target_lang',
    'log_name',
    'save_whole',
    'accepted_min_lang_prob',
    'stt_only',
  ];
  mode = Mode.SingleSided;
  modeObj = MODE_OBJ;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
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

    this.route.queryParamMap
      .pipe(
        takeUntil(this.destroy$),
        tap((queryParamMap) => {
          const [
            candidates,
            main_lang,
            target_lang,
            log_name,
            save_whole,
            accepted_min_lang_prob,
            stt_only,
          ] = this.queryParamKeys.map((key) => queryParamMap.get(key));

          if (typeof candidates === 'string') {
            this.recorderService.candidates = candidates.split(',');
          }
          if (typeof main_lang === 'string') {
            this.recorderService.main_lang = main_lang;
          }
          if (typeof target_lang === 'string') {
            this.recorderService.target_lang = target_lang;
          }
          this.recorderService.log_name = log_name;
          this.recorderService.save_whole = save_whole;
          this.recorderService.accepted_min_lang_prob = accepted_min_lang_prob;
          this.recorderService.stt_only = stt_only;
        })
      )
      .subscribe();

    this.initQueryParams();

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

  initQueryParams(): void {
    const [
      _candidates,
      _main_lang,
      _target_lang,
      _log_name,
      _save_whole,
      _accepted_min_lang_prob,
      _stt_only,
    ] = this.queryParamKeys.map((key) =>
      this.route.snapshot.queryParamMap.get(key)
    );
    const {
      candidates,
      main_lang,
      target_lang,
      log_name,
      save_whole,
      accepted_min_lang_prob,
      stt_only,
    } = this.recorderService;

    const params: Params = {
      candidates: _candidates ?? candidates.join(','),
      main_lang: _main_lang ?? main_lang,
      target_lang: _target_lang ?? target_lang,
      log_name: _log_name ?? log_name,
      save_whole: _save_whole ?? save_whole,
      accepted_min_lang_prob: _accepted_min_lang_prob ?? accepted_min_lang_prob,
      stt_only: _stt_only ?? stt_only,
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  onBreakpoints(breakpoints: { [key: string]: boolean }) {
    const ltMD = !breakpoints[MediaQuery.MD];
    const isLandscape = breakpoints[MediaQuery.Landscape];

    let _mode: Mode = this.mode;

    switch (this.mode) {
      case Mode.SingleSided:
        break;
      case Mode.DualSided:
        if (ltMD) {
          _mode = Mode.SingleSided;
        }
        break;
      case Mode.FaceToFace:
        if (ltMD && isLandscape) {
          _mode = Mode.SingleSided;
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
