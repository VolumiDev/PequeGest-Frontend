import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export class FormUtils {
  //Expresiones regulares
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  // prettier-ignore
  static notOnlySpacesPattern = '^(?!\s*$)[A-Za-z0-9\s]+$';
  static dniLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';

  static getTextError(errors: ValidationErrors): string | null {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'futureDate':
          return 'La fecha debe ser anterior a la fecha actual';

        case 'minlength':
          return `Minimo de ${errors['minlength'].requiredLength} caracteres`;

        case 'notStrider':
          return `No puede usar ese nombre`;

        case 'emailTaken':
          return `El correo electrónico ya esta siendo usado por otro usuario`;

        case 'dniNieInvalidFormat':
          return `El dni/nie no tiene un formato correcto`;
        case 'pattern':
          if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
            return 'El valor ingresado no parece un correo electrónico';
          }
          if (
            errors['pattern'].requiredPattern === FormUtils.notOnlySpacesPattern
          ) {
            return 'No introduzca espacios en blanco únicamente';
          }
          return 'Error de patrón contra expresión regular';
        default:
          return `Error de validacion sin controlar ${key}`;
      }
    }
    return null;
  }

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return (
      !!form.controls[fieldName].errors && form.controls[fieldName].touched
    );
  }

  static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return this.getTextError(errors);
  }

  static customDateFormater(): string {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
  }

  static birthdateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // No se realiza la validación si el campo está vacío, se asume que Validators.required se encarga de ello.
    }
    const inputDate = new Date(control.value);
    const currentDate = new Date();

    // Se compara solo la parte de la fecha (sin horas) si es necesario.
    if (inputDate >= currentDate) {
      return { futureDate: 'La fecha debe ser anterior a la fecha actual' };
    }

    return null;
  }

  static targetUsersValidator(hashesList: () => string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (hashesList().length === 0) {
        return { noDestinatary: 'No hay ningún destinatario en la lista' };
      }
      return null;
    };
  }

  static dniNieValidator(control: AbstractControl): ValidationErrors | null {
    const value = (control.value || '').toUpperCase().trim();

    const dniMatch = /^(\d{8})([A-Z])$/.exec(value);

    const nieMatch = /^([XYZ])(\d{7})([A-Z])$/.exec(value);
    if (dniMatch) {
      //TODO Para las pruebas lo comentamos
      // const number = parseInt(dniMatch[1], 10);
      // const letter = dniMatch[2];
      // const expectedLetter = this.dniLetters[number % 23];
      // if (letter !== expectedLetter) {
      //   return { dniNieInvalidLetter: true };
      // }
      return null;
    }

    if (nieMatch) {
      //TODO Para las pruebas lo comentamos
      // const prefix = { X: '0', Y: '1', Z: '2' }[nieMatch[1]];
      // const number = parseInt(prefix + nieMatch[2], 10);
      // const letter = nieMatch[3];
      // const expectedLetter = this.dniLetters[number % 23];
      // if (letter !== expectedLetter) {
      //   return { dniNieInvalidLetter: true };
      // }
      return null;
    }

    return { dniNieInvalidFormat: true };
  }
}
