import { Injectable } from '@angular/core';
//import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireList,  AngularFireDatabase } from 'angularfire2/database';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
//import { ExecOptions } from 'child_process';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})

export class ContactService {

  constructor(private firebase: AngularFireDatabase, private router: Router) { }


  //#region Contacts

  contactlist: AngularFireList<any>;  
  iscontactsave: boolean = false;
  MaxVal: number = 0;  
  number_: number = 0;
  isenteronmethod: boolean = false;
  public angularForm;
 
  getContacts()
  {
    this.contactlist = this.firebase.list('contacts');
    return this.contactlist.snapshotChanges();
  }

  getMaxNumber(name, number, imagename, imageurl, pdfname, pdfurl, idadded)
  {
    debugger    
    this.isenteronmethod = idadded;
    this.MaxVal = 0;
    this.contactlist = this.firebase.list('contacts');
  
    this.contactlist.snapshotChanges().subscribe(
      list => {
        this.number_ = list.length;

        if(!this.isenteronmethod) {
          this.isenteronmethod = true;
          if(this.number_ > 0) {
            this.contactlist = this.firebase.list('contacts', ref => ref.limitToLast(1));
            this.iscontactsave = idadded;    
    
            this.contactlist.snapshotChanges(['child_added'])
            .subscribe(actions => {
              actions.forEach(action => {
                if (!this.iscontactsave) {
                
                  this.MaxVal = Number(action.key)
                  this.AddContact(name, number, imagename, imageurl, pdfname, pdfurl, this.MaxVal+1);
                }else {
                 
                }
              });
            });
          }
          else {
            this.AddContact(name, number, imagename, imageurl, pdfname, pdfurl, this.MaxVal+1);
          }
        }
      });
  }


  AddContact(name, number, imagename, imageurl, pdfname, pdfurl, maxid) {
    this.iscontactsave = true;   

    if(imageurl == "") {
      imageurl = 'icons/img2.png';
    }

    var myData = {
      id: maxid,
      companyname: name,
      number: number,
      imagename: imagename,
      imageurl: imageurl,
      pdfname: pdfname,
      pdfurl: pdfurl
    };  

    var db = this.firebase.object('contacts/'+ maxid).set(myData);    
    this.router.navigate(['ContactsComponent']);    
  }

  InitializeFormFields(_IsAdd, _contact) {

    console.log(_contact);

    var comval = '';
    var numval = '';
    var imagename = '';
    var imageurl = '';
    var pdfname = '';
    var pdfurl = '';
    var id_ = 0;

    if(!_IsAdd) {
      comval = _contact.companyname;
      numval = _contact.number;
      id_ = _contact.id;
      imagename = _contact.imagename;
      imageurl = _contact.imageurl;
      pdfname = _contact.pdfname;
      pdfurl = _contact.pdfurl;
    }    
    
    this.angularForm = new FormGroup({
      id: new FormControl(id_),
      companyname: new FormControl(comval),
      number: new FormControl(numval),
      imagename: new FormControl(imagename),
      imageurl: new FormControl(imageurl),
      pdfname: new FormControl(pdfname),
      pdfurl: new FormControl(pdfurl)
    });
  }

  DeleteRecord($key) {
    this.contactlist = this.firebase.list('contacts');
    this.contactlist.remove($key);
  }

  //#endregion

  //#region Vehicles

  vehiclelist: AngularFireList<any>;
  isvehiclesave: boolean = false;  
  vehicle_MaxVal: number = 0;  
  vehicle_number_: number = 0;
  vehicle_isenteronmethod: boolean = false;
  public vehicle_angularForm;


  getVehicles()
  {
    this.vehiclelist = this.firebase.list('vehicles');
    return this.vehiclelist.snapshotChanges();
  }

  getvehicle_MaxNumber(unitno, make, model, year, serialno, licenseplate, imagename, imageurl, pdfname, pdfurl, idadded)
  {
    debugger    

    this.vehicle_isenteronmethod = idadded;
    this.vehicle_MaxVal = 0;
    this.vehiclelist = this.firebase.list('vehicles');

    this.vehiclelist.snapshotChanges().subscribe(
      list => {
        this.vehicle_number_ = list.length;

        if(!this.vehicle_isenteronmethod) {
          this.vehicle_isenteronmethod = true;
          if(this.vehicle_number_ > 0) {

            //#region Get MaxNumber
            this.vehiclelist = this.firebase.list('vehicles', ref => ref.limitToLast(1));
    
            this.isvehiclesave = idadded;
        
            this.vehiclelist.snapshotChanges(['child_added'])
            .subscribe(actions => {
              actions.forEach(action => {
                if (!this.isvehiclesave) {
                  this.vehicle_MaxVal = Number(action.key)
                  this.AddVehicle(unitno, make, model, year, serialno, licenseplate, imagename, imageurl, pdfname, pdfurl, this.vehicle_MaxVal+1);
                } else {
        
                }        
              });
            });            
            //#endregion
          }
          else {
            this.AddVehicle(unitno, make, model, year, serialno, licenseplate, imagename, imageurl, pdfname, pdfurl, this.vehicle_MaxVal+1);
          }
        }
      });
  }

  AddVehicle(unitno, make, model, year, serialno, licenseplate, imagename, imageurl, pdfname, pdfurl, maxid) {
    this.isvehiclesave = true;   

    if(imageurl == "") {
      imageurl = 'icons/car.png';
    }

    var myData = {
      id: maxid,
      unitno: unitno,
      make: make,
      model: model,
      year: year,
      serialno: serialno,
      licenseplate: licenseplate,
      imagename: imagename,
      imageurl: imageurl,
      pdfname: pdfname,
      pdfurl: pdfurl
    };  

    var db = this.firebase.object('vehicles/'+ maxid).set(myData);    
    this.router.navigate(['VehicleComponent']);    
  }

  Vehicle_InitializeFormFields(_IsAdd, _vehicle) {    

    var unitno = '';
    var make = '';
    var model = '';
    var year = '';
    var serialno = '';
    var licenseplate = '';
    var imagename = '';
    var imageurl = '';
    var pdfname = '';
    var pdfurl = '';
    var id_ = 0;

    if(!_IsAdd) {      
      unitno = _vehicle.unitno;
      make = _vehicle.make;
      model = _vehicle.model;
      year = _vehicle.year;
      serialno = _vehicle.serialno;
      licenseplate = _vehicle.licenseplate;
      id_ = _vehicle.id;
      imagename = _vehicle.imagename;
      imageurl = _vehicle.imageurl;
      pdfname = _vehicle.pdfname;
      pdfurl = _vehicle.pdfurl;
    }    
    
    this.vehicle_angularForm = new FormGroup({
      id: new FormControl(id_),
      unitno: new FormControl(unitno),
      make: new FormControl(make),
      model: new FormControl(model),
      year: new FormControl(year),
      serialno: new FormControl(serialno),
      licenseplate: new FormControl(licenseplate),
      imagename: new FormControl(imagename),
      imageurl: new FormControl(imageurl),
      pdfname: new FormControl(pdfname),
      pdfurl: new FormControl(pdfurl)
    });
  }

  Vehicle_DeleteRecord($key) {
    this.vehiclelist = this.firebase.list('vehicles');
    this.vehiclelist.remove($key);
  }

  //#endregion

  //#region Trucks

  truckslist: AngularFireList<any>;
  istrucksave: boolean = false;  
  truck_MaxVal: number = 0;
  truck_number_: number = 0;
  truck_isenteronmethod: boolean = false;
  public truck_angularForm;


  getTrucks()
  {
    this.truckslist = this.firebase.list('trucks');
    return this.truckslist.snapshotChanges();
  }

  gettruck_MaxNumber(unitno, make, model, year, serialno, licenseplate, imagename, imageurl, pdfname, pdfurl, idadded)
  {
    debugger

    this.truck_isenteronmethod = idadded;
    this.truck_MaxVal = 0;
    this.truckslist = this.firebase.list('trucks');

    this.truckslist.snapshotChanges().subscribe(
      list => {
        this.truck_number_ = list.length;

        if(!this.truck_isenteronmethod) {
          this.truck_isenteronmethod = true;
          if(this.truck_number_ > 0) {

            //#region Get MaxNumber
            this.truckslist = this.firebase.list('trucks', ref => ref.limitToLast(1));
    
            this.istrucksave = idadded;
        
            this.truckslist.snapshotChanges(['child_added'])
            .subscribe(actions => {
              actions.forEach(action => {
                if (!this.istrucksave) {
                  this.truck_MaxVal = Number(action.key)
                  this.AddTruck(unitno, make, model, year, serialno, licenseplate, imagename, imageurl, pdfname, pdfurl, this.truck_MaxVal+1);
                } else {

                }
              });
            });         
            //#endregion
          }
          else {
            this.AddTruck(unitno, make, model, year, serialno, licenseplate, imagename, imageurl, pdfname, pdfurl, this.truck_MaxVal+1);
          }
        }
      });
  }

  AddTruck(unitno, make, model, year, serialno, licenseplate, imagename, imageurl, pdfname, pdfurl, maxid) {
    this.istrucksave = true;   

    if(imageurl == "") {
      imageurl = 'icons/img.png';
    }

    var myData = {
      id: maxid,
      unitno: unitno,
      make: make,
      model: model,
      year: year,
      serialno: serialno,
      licenseplate: licenseplate,
      imagename: imagename,
      imageurl: imageurl,
      pdfname: pdfname,
      pdfurl: pdfurl
    };  

    var db = this.firebase.object('trucks/'+ maxid).set(myData);    
    this.router.navigate(['TruckComponent']);    
  }

  Truck_InitializeFormFields(_IsAdd, _truck) {    

    var unitno = '';
    var make = '';
    var model = '';
    var year = '';
    var serialno = '';
    var licenseplate = '';
    var imagename = '';
    var imageurl = '';
    var pdfname = '';
    var pdfurl = '';
    var id_ = 0;

    if(!_IsAdd) {      
      unitno = _truck.unitno;
      make = _truck.make;
      model = _truck.model;
      year = _truck.year;
      serialno = _truck.serialno;
      licenseplate = _truck.licenseplate;
      id_ = _truck.id;
      imagename = _truck.imagename;
      imageurl = _truck.imageurl;
      pdfname = _truck.pdfname;
      pdfurl = _truck.pdfurl;
    }    
    
    this.truck_angularForm = new FormGroup({
      id: new FormControl(id_),
      unitno: new FormControl(unitno),
      make: new FormControl(make),
      model: new FormControl(model),
      year: new FormControl(year),
      serialno: new FormControl(serialno),
      licenseplate: new FormControl(licenseplate),
      imagename: new FormControl(imagename),
      imageurl: new FormControl(imageurl),
      pdfname: new FormControl(pdfname),
      pdfurl: new FormControl(pdfurl)
    });
  }

  Truck_DeleteRecord($key) {
    this.truckslist = this.firebase.list('trucks');
    this.truckslist.remove($key);
  }

  //#endregion

  //#region Equipments

  equipmentslist: AngularFireList<any>;
  isequipmentsave: boolean = false;  
  equipment_MaxVal: number = 0;  
  equipment_number_: number = 0;
  equipment_isenteronmethod: boolean = false;
  public equipment_angularForm;


  getEquipments()
  {
    this.equipmentslist = this.firebase.list('equipments');
    return this.equipmentslist.snapshotChanges();
  }

  getequipment_MaxNumber(unitno, make, model, year, serialno, description, imagename, imageurl, pdfname, pdfurl, idadded)
  {
    debugger

    this.equipment_isenteronmethod = idadded;
    this.equipment_MaxVal = 0;
    this.equipmentslist = this.firebase.list('equipments');

    this.equipmentslist.snapshotChanges().subscribe(
      list => {
        this.equipment_number_ = list.length;

        if(!this.equipment_isenteronmethod) {
          this.equipment_isenteronmethod = true;
          if(this.equipment_number_ > 0) {

            //#region Get MaxNumber
            this.equipmentslist = this.firebase.list('equipments', ref => ref.limitToLast(1));
    
            this.isequipmentsave = idadded;

            this.equipmentslist.snapshotChanges(['child_added'])
            .subscribe(actions => {
              actions.forEach(action => {
                if (!this.isequipmentsave) {
                  this.equipment_MaxVal = Number(action.key)
                  this.AddEquipment(unitno, make, model, year, serialno, description, imagename, imageurl, pdfname, pdfurl, this.equipment_MaxVal+1);
                } else {

                }
              });
            });       
            //#endregion
          }
          else {
            this.AddEquipment(unitno, make, model, year, serialno, description, imagename, imageurl, pdfname, pdfurl, this.equipment_MaxVal+1);
          }
        }
      });
  }

  AddEquipment(unitno, make, model, year, serialno, description, imagename, imageurl, pdfname, pdfurl, maxid) {
    this.isequipmentsave = true;   

    if(imageurl == "") {
      imageurl = 'icons/img3.png';
    }

    var myData = {
      id: maxid,
      unitno: unitno,
      make: make,
      model: model,
      year: year,
      serialno: serialno,
      description: description,
      imagename: imagename,
      imageurl: imageurl,
      pdfname: pdfname,
      pdfurl: pdfurl
    };  

    var db = this.firebase.object('equipments/'+ maxid).set(myData);    
    this.router.navigate(['EquipmentComponent']);    
  }

  Equipment_InitializeFormFields(_IsAdd, _equipment) {    

    var unitno = '';
    var make = '';
    var model = '';
    var year = '';
    var serialno = '';
    var description = '';
    var imagename = '';
    var imageurl = '';
    var pdfname = '';
    var pdfurl = '';
    var id_ = 0;

    if(!_IsAdd) {      
      unitno = _equipment.unitno;
      make = _equipment.make;
      model = _equipment.model;
      year = _equipment.year;
      serialno = _equipment.serialno;
      description = _equipment.description;
      id_ = _equipment.id;
      imagename = _equipment.imagename;
      imageurl = _equipment.imageurl;
      pdfname = _equipment.pdfname;
      pdfurl = _equipment.pdfurl;
    }    
    
    this.equipment_angularForm = new FormGroup({
      id: new FormControl(id_),
      unitno: new FormControl(unitno),
      make: new FormControl(make),
      model: new FormControl(model),
      year: new FormControl(year),
      serialno: new FormControl(serialno),
      description: new FormControl(description),
      imagename: new FormControl(imagename),
      imageurl: new FormControl(imageurl),
      pdfname: new FormControl(pdfname),
      pdfurl: new FormControl(pdfurl)
    });
  }

    Equipment_DeleteRecord($key) {
    this.equipmentslist = this.firebase.list('equipments');
    this.equipmentslist.remove($key);
  }

  //#endregion

  //#region Trailers

  trailerslist: AngularFireList<any>;
  istrailersave: boolean = false;  
  trailer_MaxVal: number = 0;  
  trailer_number_: number = 0;
  trailer_isenteronmethod: boolean = false;
  public trailer_angularForm;


  getTrailers()
  {
    this.trailerslist = this.firebase.list('trailers');
    return this.trailerslist.snapshotChanges();
  }

  gettrailer_MaxNumber(unitno, make, model, year, serialno, licenseplate, imagename, imageurl, pdfname, pdfurl, idadded)
  {
    debugger
    this.trailer_isenteronmethod = idadded;
    this.trailer_MaxVal = 0;
    this.trailerslist = this.firebase.list('trailers');

    this.trailerslist.snapshotChanges().subscribe(
      list => {
        this.trailer_number_ = list.length;

        if(!this.trailer_isenteronmethod) {
          this.trailer_isenteronmethod = true;
          if(this.trailer_number_ > 0) {

            //#region Get MaxNumber
            this.trailerslist = this.firebase.list('trailers', ref => ref.limitToLast(1));
    
            this.istrailersave = idadded;

            this.trailerslist.snapshotChanges(['child_added'])
            .subscribe(actions => {
              actions.forEach(action => {
                if (!this.istrailersave) {
                  this.trailer_MaxVal = Number(action.key)
                  this.AddTrailer(unitno, make, model, year, serialno, licenseplate, imagename, imageurl, pdfname, pdfurl, this.trailer_MaxVal+1);
                } else {
                  
                }
              });
            });     
            //#endregion
          }
          else {
            this.AddTrailer(unitno, make, model, year, serialno, licenseplate, imagename, imageurl, pdfname, pdfurl, this.trailer_MaxVal+1);
          }
        }
      });
  }

  AddTrailer(unitno, make, model, year, serialno, licenseplate, imagename, imageurl, pdfname, pdfurl, maxid) {
    this.istrailersave = true;   

    if(imageurl == "") {
      imageurl = 'icons/img.png';
    }

    var myData = {
      id: maxid,
      unitno: unitno,
      make: make,
      model: model,
      year: year,
      serialno: serialno,
      licenseplate: licenseplate,
      imagename: imagename,
      imageurl: imageurl,
      pdfname: pdfname,
      pdfurl: pdfurl
    };  

    var db = this.firebase.object('trailers/'+ maxid).set(myData);    
    this.router.navigate(['TrailerComponent']);    
  }

  Trailer_InitializeFormFields(_IsAdd, _trailer) {    

    var unitno = '';
    var make = '';
    var model = '';
    var year = '';
    var serialno = '';
    var licenseplate = '';
    var imagename = '';
    var imageurl = '';
    var pdfname = '';
    var pdfurl = '';
    var id_ = 0;

    if(!_IsAdd) {      
      unitno = _trailer.unitno;
      make = _trailer.make;
      model = _trailer.model;
      year = _trailer.year;
      serialno = _trailer.serialno;
      licenseplate = _trailer.licenseplate;
      id_ = _trailer.id;
      imagename = _trailer.imagename;
      imageurl = _trailer.imageurl;
      pdfname = _trailer.pdfname;
      pdfurl = _trailer.pdfurl;
    }    
    
    this.trailer_angularForm = new FormGroup({
      id: new FormControl(id_),
      unitno: new FormControl(unitno),
      make: new FormControl(make),
      model: new FormControl(model),
      year: new FormControl(year),
      serialno: new FormControl(serialno),
      licenseplate: new FormControl(licenseplate),
      imagename: new FormControl(imagename),
      imageurl: new FormControl(imageurl),
      pdfname: new FormControl(pdfname),
      pdfurl: new FormControl(pdfurl)
    });
  }

  Trailer_DeleteRecord($key) {
    this.trailerslist = this.firebase.list('trailers');
    this.trailerslist.remove($key);
  }

  //#endregion

}
