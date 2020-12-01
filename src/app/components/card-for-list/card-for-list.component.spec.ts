import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardForListComponent } from './card-for-list.component';

describe('CardForListComponent', () => {
  let component: CardForListComponent;
  let fixture: ComponentFixture<CardForListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardForListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardForListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
