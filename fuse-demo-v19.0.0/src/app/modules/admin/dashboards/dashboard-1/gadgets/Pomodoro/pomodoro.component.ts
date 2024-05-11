import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'pomodoro',
  templateUrl: './pomodoro.component.html',
  styleUrls: ['./pomodoro.component.scss'],
  standalone: true
})
export class pomodoroComponent implements OnInit, OnDestroy {
  breakLength: number = 5;
  sessionLength: number = 25;
  sessionType: string = 'Session';
  timeLeft: string = ''; // Initialize timeLeft as an empty string
  fillHeight: string = '0%';

  originalTime: number = this.sessionLength * 60;
  currentLength: number = this.sessionLength * 60;
  timerRunning: boolean = false;
  secs: number = this.originalTime;
  fillColor: string = '#7DE891';
  
  intervalId: any;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}

  displayTimeRemaining(d: number): string {
    d = Number(d);
    var hours: number = Math.floor(d / 3600);
    var minutes: number = Math.floor((d % 3600) / 60);
    var seconds: number = Math.floor(d % 3600 % 60);
    return (
      (hours > 0 ? hours + ':' + (minutes < 10 ? '0' : '') : '') +
      minutes +
      ':' +
      (seconds < 10 ? '0' : '') +
      seconds
    );
  }

  sessionIncrement(time: number) {
    if (!this.timerRunning && this.sessionType === 'Session') {
      this.sessionLength += time;
      if (this.sessionLength < 1) {
        this.sessionLength = 1;
      }
      this.timeLeft = this.displayTimeRemaining(this.sessionLength * 60); // Update timeLeft
      this.originalTime = this.sessionLength * 60;
      this.secs = 60 * this.sessionLength;
    }
  }

  breakIncrement(time: number) {
    if (!this.timerRunning) {
      this.breakLength += time;
      if (this.breakLength < 1) {
        this.breakLength = 1;
      }
      if (this.sessionType === 'Break!') {
        this.timeLeft = this.displayTimeRemaining(this.breakLength * 60); // Update timeLeft
        this.originalTime = this.breakLength * 60;
        this.secs = 60 * this.breakLength;
      }
    }
  }

  timerStartStop() {
    if (!this.timerRunning) {
      if (this.sessionType === 'Session') {
        this.currentLength = this.sessionLength * 60;
      } else {
        this.currentLength = this.breakLength * 60;
      }
      this.updateTimer();
      this.timerRunning = true;
      this.intervalId = setInterval(() => this.updateTimer(), 1000);
    } else {
      clearInterval(this.intervalId);
      this.timerRunning = false;
    }
  }

  updateTimer() {
    this.secs -= 1;
    if (this.secs < 0) {
      var wav = 'http://www.oringz.com/oringz-uploads/sounds-917-communication-channel.mp3';
      var audio = new Audio(wav);
      audio.play();

      this.fillColor = '#333';
      if (this.sessionType === 'Break!') {
        this.sessionType = 'Session';
        this.currentLength = this.sessionLength * 60;
        this.secs = this.currentLength;
      } else {
        this.sessionType = 'Break!';
        this.currentLength = this.breakLength * 60;
        this.secs = this.currentLength;
      }
    } else {
      if (this.sessionType === 'Break!') {
        this.fillColor = '#E88B8B';
      } else {
        this.fillColor = '#7DE891';
      }

      this.timeLeft = this.displayTimeRemaining(this.secs);

      var totalTime = this.originalTime;
      var perc = Math.abs((this.secs / totalTime) * 100 - 100);
      this.fillHeight = perc + '%';
    }
  }
}
