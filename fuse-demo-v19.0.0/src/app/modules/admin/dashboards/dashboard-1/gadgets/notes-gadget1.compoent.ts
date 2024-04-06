import { Component } from '@angular/core';
import { Gadget } from './gadget.interface';

@Component({
  selector: 'app-notes-gadget',
  template: `<div class="gadget">Notes Gadget Content: {{ data }}</div>`,
  styles: [`
    .gadget { /* Styles for notes gadget */ }
  `],
  standalone: true,
})
export class NotesGadgetComponent implements Gadget {
  data = 'Notes Data';
}
