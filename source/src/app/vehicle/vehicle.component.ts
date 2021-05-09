import { Component, OnInit } from '@angular/core';
import { ContactService } from '../shared/contact.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

  constructor(private contactservice: ContactService, private router: Router) { }
  vehicleArray = [];
  original_vehicleArray = [];

  ngOnInit() {
    this.contactservice.getVehicles().subscribe(
      list => {
        this.vehicleArray = list.map(item => {
          return {
              $key: item.key,
              ...item.payload.val()
          };
        });

        this.original_vehicleArray = this.vehicleArray;
      });
  }

  public onAdd() {
    this.router.navigate(['Createvehicle']);  
    this.contactservice.Vehicle_InitializeFormFields(true, null);
  }

  public onSearchChange(newValue) {
    this.vehicleArray = this.original_vehicleArray;

    this.vehicleArray = this.vehicleArray.filter(
    book => (book.unitno + book.make + book.model + book.year + book.serialno + book.licenseplate).toLowerCase().includes(newValue.toLowerCase()));
  }

  public onUpdate(_contact) {
    this.router.navigate(['Createvehicle']);    
    this.contactservice.Vehicle_InitializeFormFields(false, _contact);
  }

  public onDelete($key) {
    this.contactservice.Vehicle_DeleteRecord($key);
  }

}
