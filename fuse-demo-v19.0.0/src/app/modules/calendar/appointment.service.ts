import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:8080/api/appointments'; // Adjust the URL as needed

  private api = 'http://localhost:8080/api/resources';



  constructor(private http: HttpClient) {}

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  getAllResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(this.apiUrl);
  }

  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`http://localhost:8080/api/appointments/${id}`);
  }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>('http://localhost:8080/api/appointments', appointment);
  }
}

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
