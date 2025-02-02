import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExhibitorRegisterFormComponent } from './exhibitor-register-form.component';

describe('ExhibitorRegisterFormComponent', () => {
  let component: ExhibitorRegisterFormComponent;
  let fixture: ComponentFixture<ExhibitorRegisterFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExhibitorRegisterFormComponent]
    });
    fixture = TestBed.createComponent(ExhibitorRegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
