import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnListComponent } from './grn-list.component';

describe('GrnListComponent', () => {
  let component: GrnListComponent;
  let fixture: ComponentFixture<GrnListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrnListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
