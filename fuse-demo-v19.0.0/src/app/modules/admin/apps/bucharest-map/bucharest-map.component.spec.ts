import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BucharestMapComponent } from './bucharest-map.component';

describe('BucharestMapComponent', () => {
  let component: BucharestMapComponent;
  let fixture: ComponentFixture<BucharestMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BucharestMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BucharestMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
