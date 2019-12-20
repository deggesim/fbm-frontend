import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal/public_api';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  @Input() titolo: string;
  @Output() upload: EventEmitter<any> = new EventEmitter();
  @Output() annulla: EventEmitter<any> = new EventEmitter();

  @ViewChild('modal', { static: false }) private modal: ModalDirective;

  form: FormGroup;

  constructor(
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {
    this.createForm();
  }

  ngOnInit() {
    console.log('UploadComponent');
  }

  apriModale() {
    this.modal.show();
  }

  chiudiModale() {
    this.modal.hide();
  }

  createForm() {
    this.form = this.fb.group({
      file: [undefined],
    });
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.form.patchValue({
          file: reader.result
        });

        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  uploadEvent() {
    console.log('this.form.value.file', this.form.value.file);
    this.upload.emit(this.form.value.file);
  }

}
