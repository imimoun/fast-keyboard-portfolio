import {
    Component,
    inject,
    ViewChild,
    ElementRef,
    AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TypingService } from '../../services/typing.service';

@Component({
    selector: 'app-typing-area',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="typing-area">
            <table class="target-table">
                <tr>
                    <td>
                        <span [innerHTML]="highlightedTargetWordHtml()"></span>
                    </td>
                </tr>
            </table>

            <input
                #typingInput type="text"
                class="superimposed-input"
                [ngModel]="typingService.inputValue()"
                (keydown)="handleKeydown($event)"
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck="false"
            >
        </div>
        <p hidden>{{ typingService.inputValue() }}</p>
    `
})

export class TypingAreaComponent implements AfterViewInit {
    public typingService = inject(TypingService);
    private sanitizer = inject(DomSanitizer);

    @ViewChild('typingInput') inputElement!: ElementRef<HTMLInputElement>;

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.inputElement.nativeElement.focus();
        }, 0);
    }

    /**
     * Generates the HTML string for the target word with current progress highlighting.
     * @returns A SafeHtml object that Angular will render without sanitizing.
     */
    public highlightedTargetWordHtml(): SafeHtml {
        let htmlString = '';
        const inputValue = this.typingService.inputValue();
        const targetWord = this.typingService.targetWord();
        const errorIndices = this.typingService.errorIndices();

        const typedLength = inputValue.length;
        const nextCharIndex = typedLength;

        for (let i = 0; i < typedLength; i++) {
            const char = targetWord[i];
            const isError = errorIndices.includes(i);
            const className = isError ? 'error-text' : 'correct-text';
            htmlString += `<span class="${className}">${char}</span>`;
        }

        const nextChar = targetWord.substring(
            nextCharIndex,
            nextCharIndex + 1
        );

        if (nextCharIndex < targetWord.length) {
            const isCurrentCharError = errorIndices.includes(nextCharIndex);

            const nextCharClassName = isCurrentCharError ? 'error-text' : 'next-char';

            htmlString += `<span class="${nextCharClassName}"><u>${nextChar}</u></span>`;

            const remainingPart = targetWord.substring(nextCharIndex + 1);
            htmlString += `<span>${remainingPart}</span>`;
        }

        return this.sanitizer.bypassSecurityTrustHtml(htmlString);
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
