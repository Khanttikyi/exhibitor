import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from 'src/app/components/alert-modal/alert-modal.component';
import { ExhibitorService } from 'src/app/services/exhibitor.services';

@Component({
  selector: 'app-exhibitor-register-form',
  templateUrl: './exhibitor-register-form.component.html',
  styleUrls: ['./exhibitor-register-form.component.scss']
})
export class ExhibitorRegisterFormComponent implements OnInit {
  companies = [
    { id: 1, name: 'Company 1' },
    { id: 2, name: 'Company 2' },
    { id: 3, name: 'Company 3' },
  ];
  countries: any[] = [];
  exhibitorErrors: string[] = [];
  exhibitorForm!: FormGroup;
  progress: number = 0;
  isLoading: boolean = false;
  constructor(private exhibitorService: ExhibitorService, private fb: FormBuilder, private modalService: NgbModal, private cdf: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadForm();
    this.getCountriesJson();
  }

  loadForm() {
    this.exhibitorForm = this.fb.group({
      event: [null, Validators.required],
      company: [null, Validators.required],
      exhibitors: this.fb.array([])
    });
  }
  get exhibitors(): FormArray {
    return this.exhibitorForm.get('exhibitors') as FormArray;
  }

  createExhibitor(): FormGroup {
    return this.fb.group({
      email: [null, [Validators.required, Validators.email,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"), this.startsWithCapitalValidator()]],
      nameOnBadge: [null, Validators.required],
      jobTitle: [null, Validators.required],
      country: [null, Validators.required],
      companyOnBadge: [null, Validators.required]
    });
  }

  addExhibitor() {
    this.exhibitors.push(this.createExhibitor());
  }
  removeExhibitor(index: number) {
    const exhibitors = this.exhibitorForm.get('exhibitors') as FormArray;
    exhibitors.removeAt(index);
  }
  
  onCompanyChange(event: any) {
    console.log(event);
    if (event && event.id) {
      if (this.exhibitorForm.value.event) {
        console.log(this.exhibitorForm.value.exhibitors);

        if (this.exhibitors.length === 0) {
          this.addExhibitor();
        }
      }
    } else {
      this.exhibitors.clear();
    }
  }


  getCompanies() {
    this.exhibitorService.getCountries().subscribe(data => {
      console.log(data);
      this.companies = data;
    });
  }
  getCountriesJson() {
    this.exhibitorService.getCountriesJson().subscribe(data => {
      const uniqueCountries = new Set();
      this.countries = data.filter((item: any) => {
        if (!uniqueCountries.has(item.country)) {
          uniqueCountries.add(item.country);
          return true;
        }
        return false;
      }).map((item: any) => ({
        id: item.coutry_code,
        name: item.country
      }));
    });
  }

  registerExhibitor(): void {

    if (this.exhibitorForm.valid && this.exhibitorForm.value.exhibitors.length > 0) {
      this.isLoading = true;
      this.exhibitorService.registerExhibitor(this.exhibitorForm.value).subscribe({
        next: (data: any) => {
          console.log('registerExhibitor', data);
          if (data.progress) {
            this.progress = Math.round(data.progress);
            const code = data.response.exhibitors.length > 0 ? data.response.exhibitors[0].S_group_reg_id : 'ABCDE';
            if (this.progress === 100) {
              setTimeout(() => {
                this.isLoading = false;
                const modalRef = this.modalService.open(AlertModalComponent, { centered: true, backdrop: 'static' });
                modalRef.componentInstance.code = code;
                modalRef.componentInstance.title = 'Registration Completed'; // Replace with actual title
                modalRef.componentInstance.type = 'success-alert';
              }, 3000);

            }
          }
        },
        error: (error: any) => {
          console.error('Error during registration:', error);
          this.isLoading = false;
          this.exhibitorErrors = error.errors.map((err: any) => `Error for exhibitor #${err.index}: ${err.error.message}`);
          console.log(this.exhibitorErrors);
          this.cdf.detectChanges();
        }
      });
    } else {
      if (this.exhibitorForm.value.exhibitors.length === 0) {
        const modalRef = this.modalService.open(AlertModalComponent, { centered: true, backdrop: 'static' });
        modalRef.componentInstance.title = 'Please Add At Least One Exhibitor';
        modalRef.componentInstance.type = 'error-alert';
      }
      this.exhibitorForm.markAllAsTouched();
    }
  }

  //for view
  startsWithCapitalValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value as string;

      if (!value || value.length === 0) {
        return null; // Valid if the field is empty
      }

      const firstChar = value.charAt(0);

      if (firstChar == firstChar.toUpperCase()) {
        return { 'startsWithCapital': true };
      }

      return null;
    };
  }
  isControlValid(controlName: string): boolean {
    const control = this.exhibitorForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.exhibitorForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
  isControlInvalidIndex(arrayName: string, index: number, controlName: string): boolean {
    const control = (this.exhibitorForm.get(arrayName) as FormArray).at(index).get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  controlHasError(validation: string, controlName: string): boolean {
    const control = this.exhibitorForm.get(controlName);
    return control ? control.hasError(validation) && (control.dirty || control.touched) : false;
  }

  isControlTouched(controlName: string): boolean {
    const control = this.exhibitorForm.controls[controlName];
    return control.dirty || control.touched;
  }
}
