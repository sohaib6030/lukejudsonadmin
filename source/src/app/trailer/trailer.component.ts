import { Component, OnInit } from '@angular/core';
import { ContactService } from '../shared/contact.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-trailer',
  templateUrl: './trailer.component.html',
  styleUrls: ['./trailer.component.css']
})
export class TrailerComponent implements OnInit {

  constructor(private contactservice: ContactService, private router: Router) { }
  trailerArray = [];
  original_trailerArray = [];

  ngOnInit() {
    this.contactservice.getTrailers().subscribe(
      list => {
        this.trailerArray = list.map(item => {
          return {
              $key: item.key,
              ...item.payload.val()
          };
        });

        this.original_trailerArray = this.trailerArray;
      });
  }

  public onAdd() {
    this.router.navigate(['Createtrailer']);  
    this.contactservice.Trailer_InitializeFormFields(true, null);
  }

  public onSearchChange(newValue) {
    this.trailerArray = this.original_trailerArray;

    this.trailerArray = this.trailerArray.filter(
      book => (book.unitno + book.make + book.model + book.year + book.serialno + book.licenseplate).toLowerCase().includes(newValue.toLowerCase()));
  }

  public onUpdate(_trailer) {
    this.router.navigate(['Createtrailer']);    
    this.contactservice.Trailer_InitializeFormFields(false, _trailer);
  }

  public onDelete($key) {
    this.contactservice.Trailer_DeleteRecord($key);
  }

}
