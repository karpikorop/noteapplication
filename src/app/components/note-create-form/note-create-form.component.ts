import {Component, EventEmitter, Output, output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NoteData} from '../../services/notes.service';
import {NbDialogRef} from '@nebular/theme';

@Component({
  selector: 'app-note-create-form',
  standalone: false,
  templateUrl: './note-create-form.component.html',
  styleUrl: './note-create-form.component.css'
})
export class NoteCreateFormComponent {

    @Output() noteAdded: EventEmitter<NoteData> = new EventEmitter();

    protected newNoteForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
                protected dialogRef: NbDialogRef<any>) {
        this.newNoteForm = formBuilder.group({
            title: ['', [Validators.required]],
            content: ['']
        });
    }

    onCancel() {
        this.newNoteForm.reset();
        this.dialogRef.close();
    }
    onSaveNote(): void {
        if (this.newNoteForm.invalid) {
            return;
        }
        const note: NoteData =  {
            ...this.newNoteForm.value,
            createdAt: new Date()
        }
        this.newNoteForm.reset();
        this.dialogRef.close(note);
        //this.noteAdded.emit(note);
    }
}
