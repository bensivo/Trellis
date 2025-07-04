import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Schemaspage } from './schemaspage';

describe('Schemaspage', () => {
  let component: Schemaspage;
  let fixture: ComponentFixture<Schemaspage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Schemaspage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Schemaspage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
