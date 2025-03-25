import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuHeaderComponent } from "../../components/side-menu/side-menu-header/side-menu-header.component";
import { SideMenuOptionComponent } from "../../components/side-menu/side-menu-option/side-menu-option.component";
import { SideMenuComponent } from "../../components/side-menu/side-menu.component";

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    SideMenuComponent
],
  templateUrl: './main-layout.component.html',
  
})
export class MainLayoutComponent {

  
 }
