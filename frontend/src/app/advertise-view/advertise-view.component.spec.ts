import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertiseViewComponent } from './advertise-view.component';

describe('AdvertiseViewComponent', () => {
  let component: AdvertiseViewComponent;
  let fixture: ComponentFixture<AdvertiseViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvertiseViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertiseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
