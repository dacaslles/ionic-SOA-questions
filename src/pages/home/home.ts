import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { DatabaseProvider } from '../../providers/database/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public hasData: boolean = false;
  public questionsList: any;
  public dataImported: boolean = false;
  private SQLFile: string = 'questions.sql';
  private SQLURI: string = 'https://s3.amazonaws.com/dacaslles.main.bucket/Ionic-SA-questions/questions.sql';


  constructor(public navCtrl: NavController, 
              private HTTPClient: HttpClient, 
              private Database: DatabaseProvider, 
              private Plat: Platform,
              private AlertCtrl: AlertController) {
    
  }

  ionViewDidLoad(): void{
    this.Plat.ready().then(()=>{
      setTimeout(()=>{
        this.Database.dataExistsCheck('questions').then((data)=>{
          this.loadRecords();
        }).catch((error)=>{
          console.dir(error);
        });
      }, 1500);
    });
  }

  loadRecords(): void{

    this.Database.retreiveAllRecords().then((data)=>{
      this.hasData = true;
      this.questionsList = data;
    }).catch((error)=>{
      console.dir(error);
    });
  }

  import(): void{
    this.Database.dataExistsCheck('questions').then((data: any)=>{
      if(data>0){
        this.Database.clearDB().then((data)=>{
          this.hasData = false;
          this.retrieveSQLFile();
        })
      }
    })
  }

  showAlert(){

    const alert = this.AlertCtrl.create({
      title: 'Update!',
      subTitle: 'Database updated',
      buttons:['OK']
    });
    alert.present();
  }

  retrieveSQLFile(){
    this.HTTPClient.get(this.SQLURI,{responseType: 'text'}).subscribe((data)=>{
      this.Database.importSQL(data).then((res)=>{
        this.dataImported = true;
        this.loadRecords();
        this.showAlert();
      }).catch((error)=>{
        console.dir(error);
      });
    });
  }
}
