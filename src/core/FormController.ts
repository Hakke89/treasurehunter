// src/core/FormController.ts

import { Form } from '../models/Form';
import { FormValidator } from './FormValidator';

export class FormController {
    private form: Form;
    private formValidator: FormValidator;

    constructor(form: Form) {
        this.form = form;
        this.formValidator = new FormValidator();
    }

    public validateForm(): boolean {
        // Sanitize the 'gridDimensions' (string) input
        this.form.gridDimensions = this.formValidator.sanitizeInput(this.form.gridDimensions);
        this.form.gameSpeed = this.formValidator.sanitizeInput(this.form.gameSpeed);

        // Validate the entire form
        const isValid = this.formValidator.validateForm(this.form);

        if (!isValid) {
            this.displayValidationErrors();
        }

        return isValid;
    }

    private displayValidationErrors(): void {
        const errors = this.formValidator.getErrors();
        errors.forEach((error: string) => {
            console.error(error);
        });
    }
}
