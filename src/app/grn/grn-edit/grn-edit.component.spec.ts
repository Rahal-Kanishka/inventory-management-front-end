import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnEditComponent } from './grn-edit.component';

describe('GrnEditComponent', () => {
  let component: GrnEditComponent;
  let fixture: ComponentFixture<GrnEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrnEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrnEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
