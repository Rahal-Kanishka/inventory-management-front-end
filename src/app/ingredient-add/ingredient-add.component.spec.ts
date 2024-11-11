import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientAddComponent } from './ingredient-add.component';

describe('IngredientAddComponent', () => {
  let component: IngredientAddComponent;
  let fixture: ComponentFixture<IngredientAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
