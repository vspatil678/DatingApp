import { Component, OnInit } from '@angular/core';

export class UserDetails {
  constructor(public name: string, public age: number, public gender: string) { }
}

@Component({
  selector: 'app-schedule-appointment',
  templateUrl: './schedule-appointment.component.html',
  styleUrls: ['./schedule-appointment.component.css']
})
export class ScheduleAppointmentComponent implements OnInit {

  public availableTimes: string[];
  // fetch or create an Object of UserDetails type and pass it to dynamic-table
  private userDetails: Array<UserDetails>;
  // required to provide the table header, you can call an api or hard code the column name.
  private tableHead: Array<string>;
  // optional, you can hard code the property name or just send the data of an object and dynamic-table component will figure out.
  private tableColName: Array<string>;
  // constructor() {
  //   this.availableTimes = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM'];
  // }
  constructor() {
    this.tableHead = new Array<string>('Name', 'Age', 'Gender');
    // this.tableColName = new Array<String>('name', 'age', 'gender');
    this.userDetails = new Array<UserDetails>();
  }
  ngOnInit() {
    this.userDetails.push(new UserDetails('Apple', 18, 'Male'));
    this.userDetails.push(new UserDetails('Banana', 24, 'Female'));
    this.userDetails.push(new UserDetails('Mango', 34, 'Male'));
    this.userDetails.push(new UserDetails('Orange', 13, 'Female'));
    this.userDetails.push(new UserDetails('Guava', 56, 'Male'));
  }

}


