import { Component, ViewChild } from '@angular/core';
import { IngredientAddComponent } from "../ingredient-add/ingredient-add.component";
import { IngredientEditComponent } from "../ingredient-edit/ingredient-edit.component";
import { ColDef } from "ag-grid-community";
import { EditCellComponent } from "../common/edit-cell/edit-cell.component";
import { FormGroup } from "@angular/forms";
import { LocationAddComponent } from "../location-add/location-add.component";
import { LocationEditComponent } from "../location-edit/location-edit.component";
import { BackEndService } from "../services/back-end.service";
import { ToastrService } from "ngx-toastr";
import { take } from "rxjs";

const GET_INGREDIENTS = '/location/users/all'
@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrl: './location-list.component.css'
})
export class LocationListComponent {

  @ViewChild(LocationAddComponent) locationAddComponent!: LocationAddComponent;
  @ViewChild(LocationEditComponent) locationEditComponent!: LocationEditComponent;

  constructor(private backEndService: BackEndService, private toastrService: ToastrService) {
    this.getLocationListData();
  }

  public getLocationListData() {
    this.backEndService.getRequest(GET_INGREDIENTS)
      .pipe(take(1))
      .subscribe(
        { next: (response) => this.locationList = response }
      )
  }
  openModal() {
    this.locationAddComponent.openModal();
  }

  context = { componentParent: this };

  openModalFromCellRenderer(data: any) {
    // Pass the data to the modal component
    this.locationEditComponent.openEditModal(data);
  }

  public locationList: any[] = []

  columnDefs: ColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'name' },
    { field: 'address' },
    { field: 'assignedStaff',
      valueFormatter: (params: any) =>( params! && !params.data ) ? 0: params.data?.users.length,
      cellStyle: function(params) {
        if (params.data && params.data?.users && params.data?.users.length > 0) {
          return { color: 'green' };
        } else {
          return { color: 'red' };
        }
      } },
    {
      field: '',
      cellRenderer: EditCellComponent
    }
  ];

  onAddModalClosed($event: any) {
    this.locationList = [...this.locationList, $event]
  }

  onAddModalEditClosed(updatedLocation: any) {
    let tempList = []
    for (let ingredient of this.locationList){
      if (updatedLocation.id != ingredient.id){
        tempList.push(ingredient)
      } else {
        tempList.push(updatedLocation)
      }
    }
    // to trigger grid update
    this.locationList = [...tempList];
  }

  onUserAddOrRemove($eventData: any){
    if($eventData){
      this.locationList = this.locationList.map(location => {
        if (location.id === $eventData.location_id) {
          return { ...location, users: $eventData.users };
        }
        return location;
      });
    }
  }
}
