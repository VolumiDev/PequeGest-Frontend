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

  // static minArrayLengthValidator(min: number): ValidatorFn {
  //   return (control: AbstractControl): ValidationErrors | null => {
  //     const value = control.value;
  //     if (Array.isArray(value) && value.length < min) {
  //       return { minArraylength: { required: min, actual: value.length } };
  //     }
  //     return null;
  //   };
  // }
}
