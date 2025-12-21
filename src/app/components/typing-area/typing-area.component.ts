import {
    Component,
    inject,
    ViewChild,
    ElementRef,
    AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TypingService } from '../../services/typing.service';

@Component({
    selector: 'app-typing-area',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './typing-area.component.html',
    styleUrl: './typing-area.component.css'
})

export class TypingAreaComponent implements AfterViewInit {
    public typingService = inject(TypingService);

    @ViewChild('typingInput') inputElement!: ElementRef<HTMLInputElement>;

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.inputElement.nativeElement.focus();
        }, 0);
    }

    public getCharClass(index: number): string {
        const inputValue = this.typingService.inputValue();
        const errorIndices = this.typingService.errorIndices();
        const typedLength = inputValue.length;

        if (index < typedLength) {
            return errorIndices.includes(index) ? 'error-text' : 'correct-text';
        } else if (index === typedLength) {
            return errorIndices.includes(index) ? 'error-text' : 'next-char';
        }
        return '';
    }

    handleKeydown(event: KeyboardEvent): void {
        const pressedKey = event.key;

        const isControlKey = (
            event.ctrlKey ||
            event.altKey ||
            event.metaKey ||
            [
                'ArrowLeft',
                'ArrowRight',
                'Tab',
                'Home',
                'End'
            ].includes(pressedKey)
        );

        const isSelectAll = (
            (event.ctrlKey || event.metaKey) &&
            pressedKey.toLowerCase() === 'a'
        );

        if (
            isControlKey ||
            isSelectAll ||
            pressedKey === 'Backspace' ||
            pressedKey === 'Delete'
        ) {
            event.preventDefault();
            return;
        }

        if (pressedKey.length === 1 || pressedKey === ' ') {
            event.preventDefault();

            this.typingService.handleKeyPress(pressedKey);
        }
    }
}
