import { Component, OnInit } from '@angular/core';
import { ContactService } from '../shared/contact.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { MatDialog } from '@angular/material';
import { finalize } from 'rxjs/operators';
//import { url } from 'inspector';


@Component({
  selector: 'app-createcontact',  
  templateUrl: './createcontact.component.html',
  styleUrls: ['./createcontact.component.css']
})
export class CreatecontactComponent implements OnInit {

  constructor(private contactService: ContactService, private storage: AngularFireStorage) { }
  submitted: boolean = false;

  angularForm = null;
  contactfileName = '';
  imagefile: File = null;
  file: File = null;
  contactimageName: '';
  image = "icons/img2.png";


  ngOnInit() {
    this.angularForm = this.contactService.angularForm;
    this.contactimageName = this.angularForm.controls.imagename.value;
    this.contactfileName = this.angularForm.controls.pdfname.value;


    if(this.angularForm.controls.imageurl.value != '') {
      this.image = this.angularForm.controls.imageurl.value;
    }
    
  }

  public onSubmit()
  {
    if(this.submitted == false && this.angularForm.controls.companyname.value != '' && this.angularForm.controls.number.value != '')
    {
      var PDF_Uploaded: boolean = false;
      var IMG_Uploaded: boolean = false;
      var PDF_URL = '';
      var IMG_URL = '';
      this.submitted = true;    

      
      //Image Upload
      if(this.imagefile != null) {
        var filepath = 'ContactImages/' + this.imagefile.name.split('.').slice(0,-1).join('.') + '_' + new Date().getTime();
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
        var filepath = 'ContactPDF/' + this.file.name.split('.').slice(0,-1).join('.') + '_' + new Date().getTime();
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
      var companyname = this.angularForm.controls.companyname.value;
      var number = this.angularForm.controls.number.value;
      var id = this.angularForm.controls.id.value;    

      if (id == 0) {
        console.log('IsAdd Method')        
        this.contactService.getMaxNumber(companyname, number, this.contactimageName, IMG_URL, this.contactfileName, PDF_URL, false);
      }
      else {
        console.log('IsEdit Method')

        if(this.contactimageName != '' && IMG_URL == '') {
          IMG_URL = this.angularForm.controls.imageurl.value;
        }

        if(this.contactfileName != '' && PDF_URL == '') {
          PDF_URL = this.angularForm.controls.pdfurl.value;
        }

        this.contactService.AddContact(companyname, number, this.contactimageName, IMG_URL, this.contactfileName, PDF_URL, id);
      }

      this.submitted = false;
    }
  }




  public contactOnFileChange(event) {
    if(event.target.files && event.target.files[0]) {
      this.contactfileName = event.target.files[0].name;
      this.file = event.target.files[0];
    }
    else {
      this.contactfileName = '';
      this.file = null;
    }    
  }

  public contactOnImageChange(event: any) {    

    if(event.target.files && event.target.files[0]) {
      
      this.contactimageName = event.target.files[0].name;
      this.imagefile = event.target.files[0];

      
      const reader = new FileReader();
      reader.onload = (e:any) => this.image = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      
    } else {
      this.image = "icons/img2.png";
      this.contactimageName = '';
      this.imagefile = null;
    }        
  }
}
