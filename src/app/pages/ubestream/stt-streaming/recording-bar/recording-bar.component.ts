import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Subject, takeUntil, tap } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

// @angular/material
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MessageO } from '../stt-streaming.models';
import { MediaQuery } from '../../../../shared/enums/media-query.enum';
import { MODE_OBJ, Mode } from '../../../../shared/enums/mode.enum';
import { RecorderService } from '../../../../shared/services/recorder.service';
import { STTStreamingService } from '../../../../shared/services/stt-streaming.service';

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

  constructor(
    private breakpointObserver: BreakpointObserver,
    private STTStreamingService: STTStreamingService,
    private recorderService: RecorderService
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
        tap((recording) => (this.recording = recording))
      )
      .subscribe();
  }

  onSelectMode(mode: Mode): void {
    this.modeEmit.emit(mode);
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

  onClearConversation(): void {
    this.STTStreamingService.clear();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
