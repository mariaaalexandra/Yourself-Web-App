import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxSchedulerModule, DxSchedulerComponent, DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
import { DxContextMenuModule, DxContextMenuTypes } from 'devextreme-angular/ui/context-menu';
import { Appointment, Resource, Service } from './calendar.service';
import { AppointmentService } from './appointment.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    DxSchedulerModule,
    DxContextMenuModule
  ],
  providers: [],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  @ViewChild(DxSchedulerComponent, { static: false }) scheduler!: DxSchedulerComponent;

  appointmentsData!: Appointment[];

  currentDate: Date = new Date();

  resourcesData: Resource[];

  groups: string[];

  crossScrollingEnabled = false;

  contextMenuItems = [];

  disabled = true;

  target: string = '.dx-scheduler-appointment';

  fetchAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe(
      (data: Appointment[]) => {
        this.appointmentsData = data;
        console.log("Appointments fetched: " + this.appointmentsData.length);
      },
      (error) => {
        console.error('Error fetching appointments', error);
      }
    );
  }

  fetchResources():void {
    this.appointmentService.getAllResources().subscribe(
        (data: Resource[]) => {
          this.resourcesData = data;
          console.log("Resources fetched: " + this.resourcesData.length);
        },
        (error) => {
          console.error('Error fetching resources', error);
        }
      );
  }

  ngOnInit(): void {
    this.fetchAppointments();
    this.fetchResources();

  }

  constructor(private appointmentService: AppointmentService) {

  }

  onAppointmentContextMenu({ appointmentData, targetedAppointmentData }: DxSchedulerTypes.AppointmentContextMenuEvent) {
    const scheduler = this.scheduler.instance;
    const resourceItems = this.resourcesData.map((item) => ({
      ...item,
      onItemClick: ({ itemData }) => scheduler.updateAppointment(appointmentData, {
        ...appointmentData,
        ...{ roomId: [itemData.id] },
      }),
    }));
    this.target = '.dx-scheduler-appointment';
    this.disabled = false;
    this.contextMenuItems = [
      {
        text: 'Open',
        onItemClick: () => scheduler.showAppointmentPopup(appointmentData),
      },
      {
        text: 'Delete',
        onItemClick: () => {scheduler.deleteAppointment(appointmentData),
        this.deleteAppointmentFromBackend(appointmentData.id);
        }
      },
      {
        text: 'Repeat Weekly',
        beginGroup: true,
        onItemClick: () => scheduler.updateAppointment(appointmentData, {
          startDate: targetedAppointmentData.startDate,
          recurrenceRule: 'FREQ=WEEKLY',
        }),
      },
      { text: 'Set Room', beginGroup: true, disabled: true },
      ...resourceItems,
    ];
  }

  onCellContextMenu({ cellData }: DxSchedulerTypes.CellContextMenuEvent) {
    const scheduler = this.scheduler.instance;
    this.target = '.dx-scheduler-date-table-cell';
    this.disabled = false;
    this.contextMenuItems = [
      {
        text: 'New Appointment',
        onItemClick: () => {
            // Open the scheduler popup to input new appointment details
            scheduler.showAppointmentPopup(
              { startDate: cellData.startDate },
              true,  // Set isNewAppointment to true
            );

            // Listen for when the appointment is saved within the popup
            scheduler.on('appointmentAdded', (e) => {
                // Extract the appointment data from the event args
                const newAppointmentData = e.appointmentData;

                // Using your existing method to create the appointment
                this.createNewAppointment(newAppointmentData);
              });
          },
      },
      {
        text: 'New Recurring Appointment',
        onItemClick: () => scheduler.showAppointmentPopup(
          {
            startDate: cellData.startDate,
            recurrenceRule: 'FREQ=DAILY',
          },
          true,
        ),
      },
      {
        text: 'Group by Room/Ungroup',
        beginGroup: true,
        onItemClick: () => {
          if (this.groups) {
            this.crossScrollingEnabled = false;
            this.groups = null;
          } else {
            this.crossScrollingEnabled = true;
            this.groups = ['roomId'];
          }
        },
      },
      {
        text: 'Go to Today',
        onItemClick: () => {
          this.currentDate = new Date();
        },
      },
    ];
  }

  onContextMenuItemClick(e: DxContextMenuTypes.ItemClickEvent) {
    (e.itemData as unknown & { onItemClick: Function }).onItemClick(e);
  }

  deleteAppointmentFromBackend(id: number): void {
    this.appointmentService.deleteAppointment(id).subscribe({
      next: () => console.log('Appointment deleted successfully'),
      error: (error) => console.error('Error deleting appointment', error)
    });
  }

  createNewAppointment(appointmentData: Appointment): void {
    this.appointmentService.createAppointment(appointmentData).subscribe({
      next: (newAppointment) => console.log('Appointment created:', newAppointment),
      error: (error) => console.error('Error creating appointment', error)
    });
  }
}
