import { Component } from '@angular/core';
import { OnConstructComponent } from '../../../shared/components/onConstruct/onConstruct.component';

@Component({
  selector: 'app-dashboard',
  imports: [OnConstructComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}
