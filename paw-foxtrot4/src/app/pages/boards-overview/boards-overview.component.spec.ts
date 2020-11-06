import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardsOverviewComponent } from './boards-overview.component';

describe('BoardsOverviewComponent', () => {
  let component: BoardsOverviewComponent;
  let fixture: ComponentFixture<BoardsOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardsOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
