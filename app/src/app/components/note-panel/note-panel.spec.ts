import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotePanel } from './note-panel';

describe('NotePanel', () => {
  let component: NotePanel;
  let fixture: ComponentFixture<NotePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotePanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotePanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
