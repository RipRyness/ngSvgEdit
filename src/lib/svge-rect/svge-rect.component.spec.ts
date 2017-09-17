import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgeRectComponent } from './svge-rect.component';

describe('MySvgRectComponent', () => {
  let component: SvgeRectComponent;
  let fixture: ComponentFixture<SvgeRectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgeRectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgeRectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
