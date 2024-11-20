import { Component, ViewChild } from '@angular/core';
import { BackEndService } from "../services/back-end.service";
import { ToastrService } from "ngx-toastr";
import { take } from "rxjs";
import { ColDef } from "ag-grid-community";
import { EditCellComponent } from "../common/edit-cell/edit-cell.component";
import { UserAddComponent } from "../user-add/user-add.component";
import { UserEditComponent } from "../user-edit/user-edit.component";

const GET_USERS = '/user/all'

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {

  @ViewChild(UserAddComponent) userAddComponent!: UserAddComponent;
  @ViewChild(UserEditComponent) userEditComponent!: UserEditComponent;

  public userList: any[] = []

  context = { componentParent: this };

  columnDefs: ColDef[] = [
    { field: 'id',
      maxWidth: 100,
      headerName: 'ID'
    },
    { field: 'name',
      filter: true
    },
    {
      field: 'type',
      maxWidth: 120,
      valueFormatter: (params: any) => (!params && !params.data && !params.data.userType
        && params.data?.userType?.name) ? 'Not Assigned' : params.data?.userType?.name.toUpperCase()
    },
    { field: 'contactNo',
      maxWidth: 120,
    },
    { field: 'email' },
    {
      field: 'createdOn',
      minWidth: 180,
      valueFormatter: (params: any) => {
        if (params.data && params.data.createdOn) {
          const date = new Date(params.data.createdOn);
          return date.toLocaleString(); // Format the date as 'MM/DD/YYYY, HH:mm:ss'
        }
        return 'No Date Provided'
      }
    },

    {
      field: '',
      cellRenderer: EditCellComponent
    }
  ];

  constructor(private backEndService: BackEndService, private toastrService: ToastrService) {
    this.getUserListData();
  }

  public getUserListData() {
    this.backEndService.getRequest(GET_USERS)
      .pipe(take(1))
      .subscribe(
        { next: (response) => this.userList = response }
      )
  }

  public openAddModal() {
    this.userAddComponent.openModal();
  }

  openModalFromCellRenderer(data: any) {
    // Pass the data to the modal component
    this.userEditComponent.openEditModal(data);
  }

  onUserAdded($event: any) {
    console.log('location add: ', $event)
    // make it compatible to the grid data
    this.userList = [...this.userList, $event]
  }

  testNewRecord(){
    console.log(this.userList[0])
    this.userList = [...this.userList, this.userList[0]]
  }

  onUserEdited(updatedModalUserData: any) {
    let tempList = []
    for (let updatedUser of this.userList){
      if (updatedUser.id != updatedModalUserData.id){
        tempList.push(updatedUser)
      } else {
        tempList.push(updatedModalUserData)
      }
    }
    // to trigger grid update
    this.userList = [...tempList];
  }
}
