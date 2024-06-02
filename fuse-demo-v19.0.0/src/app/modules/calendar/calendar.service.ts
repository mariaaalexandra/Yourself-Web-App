import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppointmentService } from "./appointment.service";

export interface Appointment {
    text: string;
    roomId: number;
    startDate: Date;
    endDate: Date;

  }

  export interface Resource {
    text: string;
    id: number;
    color: string;
  }




  @Injectable()
  export class Service {
    appointments: Appointment[] = [];

  constructor(private appointmentService: AppointmentService) {}



  getResources(): Resource[] {
    // Implement this method based on your application's logic
    return [];
  }


  }
