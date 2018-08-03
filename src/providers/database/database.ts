import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '../../../node_modules/@ionic-native/sqlite';
import { Platform } from 'ionic-angular';
import { SQLitePorter } from '../../../node_modules/@ionic-native/sqlite-porter';
import { resolveDefinition } from '../../../node_modules/@angular/core/src/view/util';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  private Database: SQLiteObject;
  private DBName: string = "ionic.db";

  constructor(public http: HttpClient, private Plat: Platform, private SQL: SQLite, private Porter: SQLitePorter) {
    console.log('Hello DatabaseProvider Provider');
  }

  init(): void {

    this.SQL.create({
      name: this.DBName,
      location: 'default'
    }).then((db: SQLiteObject) =>{
      this.Database = db;
    }).catch((e)=>{
      console.log(e);
    });
  }

  dataExistsCheck(tableName: string){

    return new Promise((resolve, reject)=>{
      this.Database.executeSql('SELECT count(*) AS numRows FROM' + tableName, []).then((data: any)=>{
        var numRows = data.rows.item(0).numRows;
        resolve(numRows);
      }).catch((e) =>{
        reject(e)
      });
    });

  }

  retreiveAllRecords(){
    return new Promise((resolve, reject)=>{
      this.Database.executeSql('SELECT text, A, B, C, D, correct FROM questions', []).then((data)=>{
        let items: any = [];
        if(data.rows.length > 0){
          var k;
          for(k=0; k<data.rows.length; k++){
            items.push({
              text: data.rows.item(k).text,
              A: data.rows.item(k).A,
              B: data.rows.item(k).B,
              C: data.rows.item(k).C,
              D: data.rows.item(k).D,
              correct: data.rows.item(k).correct
            });
          }
        }
        resolve(items);
      }).catch((error)=>{
        reject(error)
      });
    });
  }

  importSQL(sql: any){

    return new Promise((resolve, reject)=>{
      this.Porter.importSqlToDb(this.Database, sql).then((data)=>{
        resolve(data);
      }).catch((e)=>{
        reject(e)
      });
    });
  }

  clearDB(){
    return new Promise((resolve, reject)=>{
      this.Porter.wipeDb(this.Database).then((data)=>{
        resolve(data);
      }).catch((error)=>{
        reject(error);
      });
    });
    
  }
}
