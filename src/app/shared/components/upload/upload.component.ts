import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal/public_api';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
})
export class UploadComponent {
  @Input() titolo: string;
  @Output() upload: EventEmitter<any> = new EventEmitter();
  @Output() annulla: EventEmitter<any> = new EventEmitter();

  @ViewChild('modal', { static: false }) private modal: ModalDirective;
  @ViewChild('uploadElement', { static: false }) uploadElement: ElementRef;

  form: FormGroup;
  fileName = 'Scelta file';

  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder) {
    this.createForm();
  }

  apriModale() {
    this.modal.show();
  }

  chiudiModale() {
    this.form.reset();
    this.uploadElement.nativeElement.value = '';
    this.modal.hide();
  }

  createForm() {
    this.form = this.fb.group({
      file: [undefined, Validators.required],
    });
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const file: File = event.target.files[0];
      this.fileName = file.name;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.form.patchValue({
          file: reader.result,
        });

        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  uploadEvent() {
    if (this.form.valid) {
      this.upload.emit(this.form.value.file);
    }
  }
}
