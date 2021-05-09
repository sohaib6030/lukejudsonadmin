import { Component, OnInit } from '@angular/core';
import { ContactService } from '../shared/contact.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { MatDialog } from '@angular/material';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-createtruck',
  templateUrl: './createtruck.component.html',
  styleUrls: ['./createtruck.component.css']
})
export class CreatetruckComponent implements OnInit {

  constructor(private contactService: ContactService, private storage: AngularFireStorage) { }
  submitted: boolean = false;

  angularForm = null;
  truckfileName = '';
  imagefile: File = null;
  file: File = null;
  truckimageName: '';
  image = "icons/img.png";

  ngOnInit() { 
    this.angularForm = this.contactService.truck_angularForm;
    this.truckimageName = this.angularForm.controls.imagename.value;
    this.truckfileName = this.angularForm.controls.pdfname.value;

    if(this.angularForm.controls.imageurl.value != '') {
      this.image = this.angularForm.controls.imageurl.value;
    }
  }

  public onSubmit()
  {
    if(this.submitted == false && this.angularForm.controls.unitno.value != '' && this.angularForm.controls.make.value != ''
    && this.angularForm.controls.model.value != '' && this.angularForm.controls.year.value != '' 
    && this.angularForm.controls.serialno.value != '' && this.angularForm.controls.licenseplate.value != '')
    {
      var PDF_Uploaded: boolean = false;
      var IMG_Uploaded: boolean = false;
      var PDF_URL = '';
      var IMG_URL = '';
      this.submitted = true;    

      
      //Image Upload
      if(this.imagefile != null) {
        var filepath = 'TruckImages/' + this.imagefile.name.split('.').slice(0,-1).join('.') + '_' + new Date().getTime();
        const fileref = this.storage.ref(filepath);
        this.storage.upload(filepath, this.imagefile).snapshotChanges().pipe(
          finalize(()=> {
            fileref.getDownloadURL().subscribe((url)=>{              
              IMG_Uploaded = true;
              IMG_URL = url;
              this.DataUpload_ON_DB(PDF_Uploaded, IMG_Uploaded, PDF_URL, IMG_URL);
            })
          })  
        ).subscribe();        
      }
      else {
        IMG_Uploaded = true;
        IMG_URL = '';
        this.DataUpload_ON_DB(PDF_Uploaded, IMG_Uploaded, PDF_URL, IMG_URL);
      }


      //PDF Upload
      if(this.file != null) {
        var filepath = 'TruckPDF/' + this.file.name.split('.').slice(0,-1).join('.') + '_' + new Date().getTime();
        const fileref = this.storage.ref(filepath);
        this.storage.upload(filepath, this.file).snapshotChanges().pipe(
          finalize(()=> {
            fileref.getDownloadURL().subscribe((url)=>{
              PDF_Uploaded = true;
              PDF_URL = url;
              this.DataUpload_ON_DB(PDF_Uploaded, IMG_Uploaded, PDF_URL, IMG_URL);
            })
          })  
        ).subscribe();        
      }
      else {
        PDF_Uploaded = true;
        PDF_URL = '';
        this.DataUpload_ON_DB(PDF_Uploaded, IMG_Uploaded, PDF_URL, IMG_URL);
      }
    }
  }

  public DataUpload_ON_DB(PDF_Uploaded: boolean, IMG_Uploaded: boolean, PDF_URL, IMG_URL) {    

    if (PDF_Uploaded && IMG_Uploaded) {
      var unitno = this.angularForm.controls.unitno.value;
      var make = this.angularForm.controls.make.value;      
      var model = this.angularForm.controls.model.value;
      var year = this.angularForm.controls.year.value;
      var serialno = this.angularForm.controls.serialno.value;
      var licenseplate = this.angularForm.controls.licenseplate.value;
      var id = this.angularForm.controls.id.value;    

      if (id == 0) {
        this.contactService.gettruck_MaxNumber(unitno, make, model, year, serialno, licenseplate, this.truckimageName, IMG_URL, this.truckfileName, PDF_URL, false);
      }
      else {
        if(this.truckimageName != '' && IMG_URL == '') {
          IMG_URL = this.angularForm.controls.imageurl.value;
        }

        if(this.truckfileName != '' && PDF_URL == '') {
          PDF_URL = this.angularForm.controls.pdfurl.value;
        }

        this.contactService.AddTruck(unitno, make, model, year, serialno, licenseplate, this.truckimageName, IMG_URL, this.truckfileName, PDF_URL, id);
      }

      this.submitted = false;
    }
  }

  public TruckOnFileChange(event) {
    if(event.target.files && event.target.files[0]) {
      this.truckfileName = event.target.files[0].name;
      this.file = event.target.files[0];
    }
    else {
      this.truckfileName = '';
      this.file = null;
    }    
  }

  public TruckOnImageChange(event: any) {    

    if(event.target.files && event.target.files[0]) {
      
      this.truckimageName = event.target.files[0].name;
      this.imagefile = event.target.files[0];      

      const reader = new FileReader();
      reader.onload = (e:any) => this.image = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      
    } else {
      this.image = "icons/img.png";
      this.truckimageName = '';
      this.imagefile = null;
    }        
  }

}
