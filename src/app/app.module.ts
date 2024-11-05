import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AgGridModule} from "ag-grid-angular";
import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastrModule, ToastrService} from "ngx-toastr";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {provideRoutes, RouterModule, RouterOutlet, Routes} from "@angular/router";

const routes: Routes = [

  {path: '', redirectTo: '/dashboard', pathMatch: 'full'}, // Default route
  {path: 'dashboard', component: DashboardComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AgGridModule
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [

  ]
})
export class AppModule {
}
