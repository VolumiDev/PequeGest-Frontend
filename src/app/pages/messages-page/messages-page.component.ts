import { Component } from '@angular/core';
import { OnConstructComponent } from '../../shared/components/onConstruct/onConstruct.component';

@Component({
  selector: 'app-messages-page',
  imports: [OnConstructComponent],
  templateUrl: './messages-page.component.html',
})
export class MessagesComponent {}
