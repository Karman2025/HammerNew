import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerAddEditFormComponent } from './trainer-add-edit-form.component';

describe('TrainerAddEditFormComponent', () => {
  let component: TrainerAddEditFormComponent;
  let fixture: ComponentFixture<TrainerAddEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainerAddEditFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainerAddEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
