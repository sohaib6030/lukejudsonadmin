import { Component, OnInit } from '@angular/core';
import { ContactService } from '../shared/contact.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  constructor(private contactservice: ContactService, private router: Router) { }
  contactArray = [];
  original_contactArray = [];

  ngOnInit() {
    this.contactservice.getContacts().subscribe(
      list => {
        this.contactArray = list.map(item => {
          return {
              $key: item.key,
              ...item.payload.val()
          };
        });

        this.original_contactArray = this.contactArray;
      });

  }

  public onAdd() {
    this.router.navigate(['Createcontact']);  
    this.contactservice.InitializeFormFields(true, null);
  }

  public onSearchChange(newValue) {
    this.contactArray = this.original_contactArray;

    this.contactArray = this.contactArray.filter(
    book => (book.companyname + book.number).toLowerCase().includes(newValue.toLowerCase()));
  }

  public onUpdate(_contact) {
    this.router.navigate(['Createcontact']);    
    this.contactservice.InitializeFormFields(false, _contact);
  }

  public onDelete($key) {
    this.contactservice.DeleteRecord($key);
  }

}
