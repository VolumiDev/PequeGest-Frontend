import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from "../../components/side-menu/side-menu.component";
import { CommonModule } from '@angular/common';

import { TW } from '../../../../../tailwind-breakpoints'

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    SideMenuComponent,
    CommonModule
  ],
  templateUrl: './main-layout.component.html',

})
export class MainLayoutComponent implements OnInit {


  ngOnInit() {
    this.breakpointObserver.observe([TW.lg, TW.xl, TW['2xl']])
      .subscribe(result => {
        if (result.matches) {
          // Pantallas medianas o grandes: menú abierto y fijo
          this.menuOpen = true;
        } else {
          // Pantallas pequeñas: menú cerrado (drawer)
          this.menuOpen = false;
        }
      });
  }


  private breakpointObserver = inject(BreakpointObserver)

  menuOpen = true;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

}
