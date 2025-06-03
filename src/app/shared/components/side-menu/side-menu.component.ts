import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SideMenuHeaderComponent } from "./side-menu-header/side-menu-header.component";
import { SideMenuOptionComponent } from "./side-menu-option/side-menu-option.component";

@Component({
  selector: 'app-side-menu',
  imports: [SideMenuHeaderComponent, SideMenuOptionComponent],
  templateUrl: './side-menu.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
})
export class SideMenuComponent {

  @Input() menuOpen = false;
  @Output() closeMenu = new EventEmitter<void>();

  closeMenuClicked() {
    this.closeMenu.emit();
  }

}
