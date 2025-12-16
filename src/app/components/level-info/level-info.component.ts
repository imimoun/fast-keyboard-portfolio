import { Component, inject } from '@angular/core';
import { TypingService } from '../../services/typing.service';

@Component({
    selector: 'app-level-info',
    standalone: true,
    templateUrl: './level-info.component.html',
})

export class LevelInfoComponent {
    public typingService = inject(TypingService);
}
