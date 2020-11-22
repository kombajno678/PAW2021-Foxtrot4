import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeValueComponent } from './change-value.component';

describe('ChangeValueComponent', () => {
  let component: ChangeValueComponent;
  let fixture: ComponentFixture<ChangeValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeValueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
