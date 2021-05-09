import { Component, OnInit } from '@angular/core';
import { ContactService } from '../shared/contact.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-truck',
  templateUrl: './truck.component.html',
  styleUrls: ['./truck.component.css']
})
export class TruckComponent implements OnInit {

  constructor(private contactservice: ContactService, private router: Router) { }
  truckArray = [];
  original_truckArray = [];

  ngOnInit() {
    this.contactservice.getTrucks().subscribe(
      list => {
        this.truckArray = list.map(item => {
          return {
              $key: item.key,
              ...item.payload.val()
          };
        });

        this.original_truckArray = this.truckArray;
      });
  }

  public onAdd() {
    this.router.navigate(['Createtruck']);  
    this.contactservice.Truck_InitializeFormFields(true, null);
  }

  public onSearchChange(newValue) {
    this.truckArray = this.original_truckArray;

    this.truckArray = this.truckArray.filter(
    book => (book.unitno + book.make + book.model + book.year + book.serialno + book.licenseplate).toLowerCase().includes(newValue.toLowerCase()));
  }

  public onUpdate(_contact) {
    this.router.navigate(['Createtruck']);    
    this.contactservice.Truck_InitializeFormFields(false, _contact);
  }

  public onDelete($key) {
    this.contactservice.Truck_DeleteRecord($key);
  }

}
