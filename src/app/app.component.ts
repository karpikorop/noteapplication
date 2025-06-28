import {Component} from '@angular/core';
import { NbIconLibraries } from '@nebular/theme';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false,
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'noteapplication';

    constructor(private iconLibraries: NbIconLibraries) {
        // 1. Реєструємо пакет іконок Eva Icons
        this.iconLibraries.registerFontPack('eva', { iconClassPrefix: 'eva' });

        // 2. Встановлюємо його як пакет за замовчуванням
        this.iconLibraries.setDefaultPack('eva');

    }

}
