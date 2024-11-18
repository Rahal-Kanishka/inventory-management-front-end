import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from "ag-grid-angular";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { RouterLink, RouterModule, RouterOutlet, Routes } from "@angular/router";
import { IngredientListComponent } from "./ingredient-list/ingredient-list.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { OrderListComponent } from "./order-list/order-list.component";
import { HttpClientModule } from "@angular/common/http";
import { GridComponent } from "./common/grid/grid.component";
import { ReactiveFormsModule } from "@angular/forms";
import { EditCellComponent } from './common/edit-cell/edit-cell.component';
import { IngredientAddComponent } from "./ingredient-add/ingredient-add.component";
import { IngredientEditComponent } from "./ingredient-edit/ingredient-edit.component";
import { RecipeAddComponent } from "./recipe-add/recipe-add.component";
import { RecipeListComponent } from "./recipe-list/recipe-list.component";
import { RecipeEditComponent } from "./recipe-edit/recipe-edit.component";
import { ViewAndEditCellComponent } from "./common/view-and-edit-cell/view-and-edit-cell.component";
import { LocationListComponent } from './location-list/location-list.component';
import { LocationAddComponent } from './location-add/location-add.component';
import { LocationEditComponent } from './location-edit/location-edit.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserEditComponent } from './user-edit/user-edit.component';

const routes: Routes = [

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Default route
  { path: 'dashboard', component: DashboardComponent },
  { path: 'ingredient-list', component: IngredientListComponent },
  { path: 'recipe-list', component: RecipeListComponent },
  { path: 'order-list', component: OrderListComponent },
  { path: 'location-list', component: LocationListComponent },
  { path: '**', component: NotFoundComponent },


]

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    GridComponent,
    IngredientListComponent,
    IngredientAddComponent,
    IngredientEditComponent,
    NotFoundComponent,
    EditCellComponent,
    RecipeAddComponent,
    RecipeListComponent,
    RecipeEditComponent,
    ViewAndEditCellComponent,
    LocationListComponent,
    LocationAddComponent,
    LocationEditComponent,
    UserListComponent,
    UserAddComponent,
    UserEditComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    AgGridModule,
    ReactiveFormsModule
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [

  ]
})
export class AppModule {
}
