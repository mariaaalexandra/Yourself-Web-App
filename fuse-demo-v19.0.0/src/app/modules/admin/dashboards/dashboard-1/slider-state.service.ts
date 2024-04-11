// slider-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SliderStateService {
  private enlargedSliderSubject = new BehaviorSubject<boolean>(false);
  public enlargedSlider$: Observable<boolean> = this.enlargedSliderSubject.asObservable();

  constructor() { }

  toggleEnlargedSlider() {
    const currentValue = this.enlargedSliderSubject.getValue();
    this.enlargedSliderSubject.next(!currentValue);
  }
}
