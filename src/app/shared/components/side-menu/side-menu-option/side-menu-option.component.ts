import { AuthService } from './../../../../auth/services/Auth.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuOption } from '../../../../interfaces/MenuOption';

@Component({
  selector: 'app-side-menu-option',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu-option.component.html',
})
export class SideMenuOptionComponent implements OnInit {
  ngOnInit(): void {
    if (this.role() === 'ADMIN') {
      this.menuOptions = this.adminOptions;
    } else {
      this.menuOptions = this.userOptions;
    }
  }

  private authService = inject(AuthService);

  role = signal<string | null>(this.authService.getUserRole());

  menuOptions: MenuOption[] = [];

  adminOptions: MenuOption[] = [
    {
      icon: 'fa-solid fa-users',
      label: 'Usuarios',
      sublabel: 'Gestión de usuarios',
      route: '/admin/users',
    },
    {
      icon: 'fa-solid fa-school',
      label: 'Aulas',
      sublabel: 'Gestión de aulas',
      route: '/admin/classrooms',
    },
    {
      icon: 'fa-solid fa-envelope',
      label: 'Mensajes',
      sublabel: 'Mensajería directa',
      route: '/admin/messages',
    },
  ];

  userOptions: MenuOption[] = [
    {
      icon: 'fa-solid fa-gauge',
      label: 'Panel Inicial',
      sublabel: 'Información General',
      route: '/user/dashboard',
    },
    {
      icon: 'fa-solid fa-children ',
      label: 'Alumno',
      sublabel: 'Perfil Alumno',
      route: '/user/children',
    },
    {
      icon: 'fa-solid fa-envelope',
      label: 'Mensajes',
      sublabel: 'Mensajería directa',
      route: '/user/messages',
    },
  ];
}
