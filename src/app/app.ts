import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LevelInfoComponent } from './components/level-info/level-info.component';
import { TypingAreaComponent } from './components/typing-area/typing-area.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, LevelInfoComponent, TypingAreaComponent],
    templateUrl: './app.html',
    styleUrl: './app.css',
    encapsulation: ViewEncapsulation.None
})

export class App {}
