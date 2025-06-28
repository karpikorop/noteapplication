import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NotesComponent} from './components/notes/notes.component';
import {AboutComponent} from './components/about/about.component';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {
    NbActionsModule,
    NbButtonModule,
    NbCardModule, NbDialogModule, NbDialogRef,
    NbIconModule, NbInputModule,
    NbLayoutModule, NbSpinnerModule,
    NbThemeModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {HeaderComponent} from './header/header.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {ReactiveFormsModule} from '@angular/forms';
import { NoteCardComponent } from './components/note-card/note-card.component';
import { NoteCreateFormComponent } from './components/note-create-form/note-create-form.component';
import {config} from 'rxjs';

@NgModule({
    declarations: [
        AppComponent,
        NotesComponent,
        AboutComponent,
        HeaderComponent,
        NoteCardComponent,
        NoteCreateFormComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NbThemeModule.forRoot(),
        NbDialogModule.forRoot(),
        NbLayoutModule,
        NbActionsModule,
        NbIconModule,
        NbEvaIconsModule,
        NbCardModule,
        NbButtonModule,
        NbInputModule,
        ReactiveFormsModule,
        NbSpinnerModule
    ],
    providers: [
    provideFirebaseApp(() => initializeApp({ projectId: "independentnotes", appId: "1:316633347773:web:ebc00ae8c12524a79c29d4", storageBucket: "independentnotes.firebasestorage.app", apiKey: "AIzaSyCnyOeyJicmxNRGETsrju3zborP2iHKFRA", authDomain: "independentnotes.firebaseapp.com", messagingSenderId: "316633347773" })),
    provideFirestore(() => getFirestore())
  ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
