import { Component, OnInit } from '@angular/core';
import { ContactService } from '../shared/contact.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {

  constructor(private contactservice: ContactService, private router: Router) { }
  equipmentArray = [];
  original_equipmentArray = [];

  ngOnInit() {
    this.contactservice.getEquipments().subscribe(
      list => {
        this.equipmentArray = list.map(item => {
          return {
              $key: item.key,
              ...item.payload.val()
          };
        });

        this.original_equipmentArray = this.equipmentArray;
      });
  }

  public onAdd() {
    this.router.navigate(['Createequipment']);  
    this.contactservice.Equipment_InitializeFormFields(true, null);
  }

  public onSearchChange(newValue) {
    this.equipmentArray = this.original_equipmentArray;

    this.equipmentArray = this.equipmentArray.filter(
    book => (book.unitno + book.make + book.model + book.year + book.description + book.serialno).toLowerCase().includes(newValue.toLowerCase()));
  }

  public onUpdate(_equipment) {
    this.router.navigate(['Createequipment']);    
    this.contactservice.Equipment_InitializeFormFields(false, _equipment);
  }

  public onDelete($key) {
    this.contactservice.Equipment_DeleteRecord($key);
  }

}
