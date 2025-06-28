import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    standalone: false,
    styleUrl: './header.component.css'
})
export class HeaderComponent {

    
    items = [
        {
            title: 'Home',
            link: '/'
        },
        {
            title: 'About',
            link: '/about'
        }
    ];
}
