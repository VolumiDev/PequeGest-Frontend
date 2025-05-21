import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuOption } from '../../../../../../../interfaces/MenuOption';
import { RoutesServices } from '../../../../../../../services/routes.services/routes.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-student-details-side-menu-options',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './studentDetailsSideMenuOptions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDetailsSideMenuOptionsComponent {
  private routesService = inject(RoutesServices);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  paramHash = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('studentHash') ?? ''))
  );

  $path = signal(this.location.path());

  menuOptions: MenuOption[] = [
    {
      icon: 'fa-solid fa-users',
      label: 'Perfil',
      sublabel: 'Datos personales',
      route: `${this.$path()}/profile`,
    },
    {
      icon: 'fa-solid fa-school',
      label: 'Documentos',
      sublabel: 'Gestor Documentos',
      route: `${this.$path()}/documents`,
    },
    {
      icon: 'fa-solid fa-envelope',
      label: 'Mensajes',
      sublabel: 'Mensajería directa',
      route: `${this.$path()}/messages`,
    },
  ];
}
