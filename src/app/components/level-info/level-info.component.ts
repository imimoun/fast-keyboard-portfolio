import { Component, inject } from '@angular/core';
import { TypingService } from '../../services/typing.service';

@Component({
    selector: 'app-level-info',
    standalone: true,
    template: `
        <table class="level-table">
            <tr>
                <th>Previous Level</th>
                <th>Current Level</th>
                <th>Next Level</th>
            </tr>
            <tr>
                <td>
                    {{ typingService.previousLevelName }}<br />
                    {{ typingService.previousLevelCharacterSet }}
                </td>
                <td>
                    {{ typingService.currentLevelName }}<br />
                    {{ typingService.currentLevelCharacterSet }}
                </td>
                <td>
                    {{ typingService.nextLevelName }}<br />
                    {{ typingService.nextLevelCharacterSet }}
                </td>
            </tr>
        </table>
    `
})

export class LevelInfoComponent {
    public typingService = inject(TypingService);
}
