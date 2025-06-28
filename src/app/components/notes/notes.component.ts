import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {Note, NoteData, NotesService} from '../../services/notes.service';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    filter,
    map,
    Observable,
    of,
    startWith,
    Subject,
    switchMap, takeUntil
} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NbDialogService} from '@nebular/theme';
import {NoteCreateFormComponent} from '../note-create-form/note-create-form.component';

enum Status {
    Loading = '...Loading...',
    NotFound = 'Not Found',
    Empty = 'Empty',
    Success = 'Success',
    Error = 'Error'
}

interface NotesState {
    status: Status // статус завантаження
    data?: Note[];   // дані, якщо успіх
    error?: any;     // помилка, якщо невдача
}

@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    standalone: false,
    styleUrl: './notes.component.css'
})
export class NotesComponent implements OnInit {

    @ViewChild('createNoteBtn', { read: ElementRef }) createButtonRef!: ElementRef;

    protected notes$!: Observable<Note[]>;
    protected state$!: Observable<NotesState>;
    //protected @ViewChild('createNoteBtn', { read: ElementRef }) createButtonRef!: ElementRef;

    protected searchControl: FormControl<string | null> = new FormControl('', Validators.required);

    private destroy$ = new Subject<void>();

    private notesService: NotesService = inject(NotesService);

    constructor(private dialogService: NbDialogService) {

    }



    ngOnInit(): void {
        this.state$ = this.searchControl.valueChanges.pipe(
            takeUntil(this.destroy$),
            startWith(''),
            debounceTime(500),
            distinctUntilChanged(),
            map(term => term ? term : ''),
            switchMap(term => {
                    return this.notesService.getNotes().pipe(
                        map((notes: Note[]): Note[] => {
                            if(!term || term.trim() === ''){
                                return notes;
                            }

                            return notes.filter((note: Note) => {
                                return note.title.toLowerCase().includes(term.toLowerCase());
                            })
                        }),
                        map((notes: Note[]): NotesState =>({
                            status: notes.length > 0 ? Status.Success : Status.NotFound,
                            data: notes
                        })),startWith({ status: Status.Loading }),
                        catchError(error => of({
                            status: Status.Error,
                            error: error
                        }))
                    );
            }),
            startWith({ status: Status.Loading})
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    async onDeleteNote(id: string): Promise<void> {
        try {
            await this.notesService.deleteNote(id);
        } catch (error) {
            throw error;
        }
    }

    async onSaveNote(noteData: NoteData): Promise<void> {
        try{
            await this.notesService.addNote(noteData);
        }catch (error) {
            throw error;
        }
    }


    async saveEdit(updatedNote: Note) {
        try{
            await this.notesService.updateNote(updatedNote);
        }catch (error) {
            throw error;
        }
    }


    protected readonly Status = Status;

    openCreateNoteDialog() {
        this.dialogService.open(NoteCreateFormComponent, {
            dialogClass: 'note-dialog'
        }).onClose.pipe(
            takeUntil(this.destroy$)
        ).subscribe(
            (note: NoteData) => {
                if (note) {
                    this.onSaveNote(note).then().catch(console.error);
                }
            }
        );
        this.createButtonRef.nativeElement.blur();
    }
}
