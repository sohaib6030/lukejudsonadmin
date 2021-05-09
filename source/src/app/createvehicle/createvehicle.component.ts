import { Component, OnInit } from '@angular/core';
//import { CreateVehicle } from '../logic/createvehicle';
import { ContactService } from '../shared/contact.service';
//import { GeolocationService } from '../geolocation.service';
//import { TastingRating } from '../logic/tastingRating';
//import { Router, ActivatedRoute } from '@angular/router';
//import { DataService } from '../data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from 'angularfire2/storage';
import { MatDialog } from '@angular/material';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-createvehicle',
  templateUrl: './createvehicle.component.html',
  styleUrls: ['./createvehicle.component.css']
})
export class CreateVehicleComponent implements OnInit {


  constructor(private contactService: ContactService, private storage: AngularFireStorage) { }
  submitted: boolean = false;

  angularForm = null;
  vehiclefileName = '';
  imagefile: File = null;
  file: File = null;
  vehicleimageName: '';
  image = "icons/car.png";

  ngOnInit() { 
    this.angularForm = this.contactService.vehicle_angularForm;
    this.vehicleimageName = this.angularForm.controls.imagename.value;
    this.vehiclefileName = this.angularForm.controls.pdfname.value;

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
        var filepath = 'VehicleImages/' + this.imagefile.name.split('.').slice(0,-1).join('.') + '_' + new Date().getTime();
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
        var filepath = 'VehiclePDF/' + this.file.name.split('.').slice(0,-1).join('.') + '_' + new Date().getTime();
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
      var licenseplate = this.angularForm.controls.licenseplate.value;
      var id = this.angularForm.controls.id.value;    

      if (id == 0) {
        this.contactService.getvehicle_MaxNumber(unitno, make, model, year, serialno, licenseplate, this.vehicleimageName, IMG_URL, this.vehiclefileName, PDF_URL, false);
      }
      else {
        if(this.vehicleimageName != '' && IMG_URL == '') {
          IMG_URL = this.angularForm.controls.imageurl.value;
        }

        if(this.vehiclefileName != '' && PDF_URL == '') {
          PDF_URL = this.angularForm.controls.pdfurl.value;
        }

        this.contactService.AddVehicle(unitno, make, model, year, serialno, licenseplate, this.vehicleimageName, IMG_URL, this.vehiclefileName, PDF_URL, id);
      }

      this.submitted = false;
    }
  }

  public vehicleOnFileChange(event) {
    if(event.target.files && event.target.files[0]) {
      this.vehiclefileName = event.target.files[0].name;
      this.file = event.target.files[0];
    }
    else {
      this.vehiclefileName = '';
      this.file = null;
    }    
  }

  public vehicleOnImageChange(event: any) {    

    if(event.target.files && event.target.files[0]) {
      
      this.vehicleimageName = event.target.files[0].name;
      this.imagefile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e:any) => this.image = e.target.result;
      reader.readAsDataURL(event.target.files[0]);


    } else {
      this.image = "icons/car.png";
      this.vehicleimageName = '';
      this.imagefile = null;
    }        
  }

  //Old Code
  /*
  routeringPages: any;
  tastingEnabled = false;
  createvehicle: CreateVehicle;
  types = ['Brustino', 'Nigerianno', 'Americano', 'Mexicanno', 'Icelanno'];
  

  //constructor(private geolocation: GeolocationService, private router: Router, private data: DataService, private activated: ActivatedRoute) { }


  tastingRatingChanged(checked: boolean) {
    if (checked) {
      this.createvehicle.tastingRating = new TastingRating();
    } else {
      this.createvehicle.tastingRating = null;
    }
  }
  cancel() {
    this.router.navigate(['/']);

  }
  save() {
    this.data.save(this.createvehicle, result => {
      if (result) {
        this.router.navigate(['/']);
      }
    });
  }
  ngOnInit() {
    this.createvehicle = new CreateVehicle();
    this.routeringPages = this.activated.params.subscribe(params => {
      console.log(params['id']);
      if (params['id']) {
        this.data.get(params['id'], response => {
          this.createvehicle = response;
          if (this.createvehicle.tastingRating) {
            this.tastingEnabled = true;
          }
        });
      }
    });

 
    this.geolocation.requestLocation(location => {
      if (location) {
        this.createvehicle.location.latitude = location.latitude;
        this.createvehicle.location.longitude = location.longitude;
      }
    });


  }
  */

}
