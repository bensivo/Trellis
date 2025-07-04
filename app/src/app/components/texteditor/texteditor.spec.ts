import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Texteditor } from './texteditor';

describe('Texteditor', () => {
  let component: Texteditor;
  let fixture: ComponentFixture<Texteditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Texteditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Texteditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
