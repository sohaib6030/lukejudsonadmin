import { Component, OnInit } from '@angular/core';
import { ContactService } from '../shared/contact.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { MatDialog } from '@angular/material';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-createequipment',
  templateUrl: './createequipment.component.html',
  styleUrls: ['./createequipment.component.css']
})
export class CreateequipmentComponent implements OnInit {

  constructor(private contactService: ContactService, private storage: AngularFireStorage) { }
  submitted: boolean = false;

  angularForm = null;
  equipmentfileName = '';
  imagefile: File = null;
  file: File = null;
  equipmentimageName: '';
  image = "icons/img3.png";

  ngOnInit() { 
    this.angularForm = this.contactService.equipment_angularForm;
    this.equipmentimageName = this.angularForm.controls.imagename.value;
    this.equipmentfileName = this.angularForm.controls.pdfname.value;

    if(this.angularForm.controls.imageurl.value != '') {
      this.image = this.angularForm.controls.imageurl.value;
    }
  }

  public onSubmit()
  {
    if(this.submitted == false && this.angularForm.controls.unitno.value != '' && this.angularForm.controls.make.value != ''
    && this.angularForm.controls.model.value != '' && this.angularForm.controls.year.value != '' 
    && this.angularForm.controls.serialno.value != '' && this.angularForm.controls.description.value != '')
    {
      var PDF_Uploaded: boolean = false;
      var IMG_Uploaded: boolean = false;
      var PDF_URL = '';
      var IMG_URL = '';
      this.submitted = true;    

      
      //Image Upload
      if(this.imagefile != null) {
        var filepath = 'EquipmentImages/' + this.imagefile.name.split('.').slice(0,-1).join('.') + '_' + new Date().getTime();
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
        var filepath = 'EquipmentPDF/' + this.file.name.split('.').slice(0,-1).join('.') + '_' + new Date().getTime();
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
    console.log('PDF UPload' + PDF_Uploaded + ' - ' + PDF_URL);
    console.log('IMG Upload' + IMG_Uploaded + ' - ' + IMG_URL);


    if (PDF_Uploaded && IMG_Uploaded) {
      var unitno = this.angularForm.controls.unitno.value;
      var make = this.angularForm.controls.make.value;      
      var model = this.angularForm.controls.model.value;
      var year = this.angularForm.controls.year.value;
      var serialno = this.angularForm.controls.serialno.value;
      var description = this.angularForm.controls.description.value;
      var id = this.angularForm.controls.id.value;    

      if (id == 0) {
        this.contactService.getequipment_MaxNumber(unitno, make, model, year, serialno, description, this.equipmentimageName, IMG_URL, this.equipmentfileName, PDF_URL, false);
      }
      else {
        if(this.equipmentimageName != '' && IMG_URL == '') {
          IMG_URL = this.angularForm.controls.imageurl.value;
        }

        if(this.equipmentfileName != '' && PDF_URL == '') {
          PDF_URL = this.angularForm.controls.pdfurl.value;
        }

        this.contactService.AddEquipment(unitno, make, model, year, serialno, description, this.equipmentimageName, IMG_URL, this.equipmentfileName, PDF_URL, id);
      }

      this.submitted = false;
    }
  }

  public equipmentOnFileChange(event) {
    if(event.target.files && event.target.files[0]) {
      this.equipmentfileName = event.target.files[0].name;
      this.file = event.target.files[0];
    }
    else {
      this.equipmentfileName = '';
      this.file = null;
    }    
  }

  public equipmentOnImageChange(event: any) {    

    if(event.target.files && event.target.files[0]) {
      
      this.equipmentimageName = event.target.files[0].name;
      this.imagefile = event.target.files[0];     

      const reader = new FileReader();
      reader.onload = (e:any) => this.image = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      
    } else {
      this.image = "icons/img3.png";
      this.equipmentimageName = '';
      this.imagefile = null;
    }        
  }

}
