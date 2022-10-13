import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal/public_api';

@Component({
  selector: 'fbm-upload',
  templateUrl: './upload.component.html',
})
export class UploadComponent {
  @Input() title: string;
  @Output() upload: EventEmitter<any> = new EventEmitter(true);
  @Output() cancel: EventEmitter<any> = new EventEmitter(true);

  @ViewChild('modal', { static: false }) private modal: ModalDirective;
  @ViewChild('uploadElement', { static: false }) uploadElement: ElementRef;

  form: UntypedFormGroup;
  fileName = 'Scelta file';

  constructor(private cd: ChangeDetectorRef, private fb: UntypedFormBuilder) {
    this.createForm();
  }

  openModal() {
    this.modal.show();
  }

  closeModal() {
    this.form.reset();
    this.uploadElement.nativeElement.value = '';
    this.modal.hide();
  }

  createForm() {
    this.form = this.fb.group({
      file: [undefined, Validators.required],
    });
  }

  onFileChange(event: any) {
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
