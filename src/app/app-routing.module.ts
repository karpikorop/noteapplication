import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AboutComponent} from './components/about/about.component';
import {NotesComponent} from './components/notes/notes.component';


const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: NotesComponent
    },
    {
        path: 'about',
        component: AboutComponent
    }
    // Додай інші маршрути, якщо вони у тебе були

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
