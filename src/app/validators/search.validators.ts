import { AbstractControl, ValidationErrors } from '@angular/forms';

export class SearchValidators {
    // I don't have to cannotContainSpace by creating instance of the SearchValidators class
  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    if ((control.value as string).indexOf(' ') >= 0)
      return { cannotContainSpace: true };
    return null;
  }
}
