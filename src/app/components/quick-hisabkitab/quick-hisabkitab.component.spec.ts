import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickHisabkitabComponent } from './quick-hisabkitab.component';

describe('QuickHisabkitabComponent', () => {
  let component: QuickHisabkitabComponent;
  let fixture: ComponentFixture<QuickHisabkitabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickHisabkitabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickHisabkitabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
