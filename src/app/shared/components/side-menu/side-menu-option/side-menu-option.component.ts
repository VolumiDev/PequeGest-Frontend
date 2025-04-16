import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuOption } from '../../../../interfaces/MenuOption';

@Component({
  selector: 'app-side-menu-option',
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './side-menu-option.component.html',
})
export class SideMenuOptionComponent {

  menuOptions: MenuOption[] = [
    {
      icon: 'fa-solid fa-users',
      label: 'Usuarios',
      sublabel: 'Gestión de usuarios',
      route: '/home/users'
    },
    {
      icon: 'fa-solid fa-school',
      label: 'Aulas',
      sublabel: 'Gestión de aulas',
      route: '/home/classrooms'
    },
    {
      icon: 'fa-solid fa-envelope',
      label: 'Mensajes',
      sublabel: 'Mensajería directa',
      route: '/home/messages'
    },
  ]

}
