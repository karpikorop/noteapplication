import {Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {Note} from '../../services/notes.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {fakeAsync} from '@angular/core/testing';
import {NbDialogService} from '@nebular/theme';


@Component({
  selector: 'app-note-card',
  standalone: false,
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.css',

})
export class NoteCardComponent {

    @Input() note!: Note;

    @Output() noteDeleted = new EventEmitter<string>();
    @Output() noteUpdated = new EventEmitter<Note>();

    protected editForm: FormGroup;
    protected isEdited: boolean = false;

    constructor(private formBuilder: FormBuilder,
                private dialogService: NbDialogService) {
        this.editForm = this.formBuilder.group({
            title: ['', Validators.required],
            content: ['']
        });
    }

    startEdit() {
        this.isEdited = true;
        this.editForm.setValue({
            title: this.note.title,
            content: this.note.content
        });
    }

    cancelEdit() {
        this.isEdited = false;
    }

    onDeleteNote(dialog: TemplateRef<any>) {

        this.dialogService.open(dialog).onClose.subscribe(
            del => {
                if(del) {
                    this.noteDeleted.emit(this.note.id);
                }
            }
        );
    }

    saveEdit(note: Note) {

        if (this.editForm.invalid) {
            return;
        }

        const updatedNote: Note = {
            ...note,
            ...this.editForm.value,
            updatedAt: new Date()
        };
        this.noteUpdated.emit(updatedNote);
        this.editForm.reset();
        this.isEdited = false;
    }
}
