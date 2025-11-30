import {
    Component,
    signal,
    ChangeDetectorRef,
    ViewEncapsulation,
    ViewChild,
    ElementRef,
    AfterViewInit
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, FormsModule],
    templateUrl: './app.html',
    styleUrl: './app.css',
    encapsulation: ViewEncapsulation.None
})
export class App implements AfterViewInit {
    private readonly BLOCK_SIZE: number = 20;

    private readonly LEVEL_PREFIX: string = 'Level ';

    @ViewChild('typingInput') inputElement!: ElementRef<HTMLInputElement>;

    private readonly CHARACTER_SETS: string[] = [
        "חכ",
        "לג",
        "ךד",
        "ףש",
        "יע",
        "ור",
        "ןק",
        "ם",
        "פ",
        "טא",
        "צה",
        "תב",
        "ץס",
        ".ז",
        "מנ",
        ",",
    ];

    public level: number = 0;

    inputValue: string = '';

    public targetWord: string = this._generateRandomTargetWord(this.BLOCK_SIZE, this.level);

    public errorIndices: number[] = [];

    constructor(private cdr: ChangeDetectorRef, private sanitizer: DomSanitizer) {}

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.inputElement.nativeElement.focus();
        }, 0);
    }

    /**
     * Get the full character set for a given level (index).
     * Includes the characters from the specified level AND all previous levels.
     * @param targetLevel The 0-indexed level to get the cumulative character set for.
     * @returns A string representing the full character set.
     */
    private _getCumulativeCharacterSet(targetLevel: number): string {
        if (
            targetLevel < 0 ||
            this.CHARACTER_SETS.length <= targetLevel
        ) {
            return '';
        }

        return this.CHARACTER_SETS.slice(0, targetLevel + 1).join('');
    }

    public get previousLevelName(): string {
        if (this.level > 0) {
            return this.LEVEL_PREFIX + this.level;
        }
        return 'N/A';
    }

    public get previousLevelCharacterSet(): string {
        if (1 <= this.level) {
            return this.CHARACTER_SETS[this.level - 1];
        }
        return 'N/A';
    }

    public get currentLevelName(): string {
        return this.LEVEL_PREFIX + (this.level + 1);
    }

    public get currentLevelCharacterSet(): string {
        return this.CHARACTER_SETS[this.level];
    }

    public get nextLevelName(): string {
        if (this.level < this.CHARACTER_SETS.length - 1) {
            return this.LEVEL_PREFIX + (this.level + 2);
        }
        return 'N/A';
    }

    public get nextLevelCharacterSet(): string {
        if (this.level < this.CHARACTER_SETS.length - 1) {
            return this.CHARACTER_SETS[this.level + 1];
        }
        return 'N/A';
    }

    /**
     * Generates the HTML string for the target word with current progress highlighting.
     * @returns A SafeHtml object that Angular will render without sanitizing.
     */
    public getHighlightedTargetWordHtml(): SafeHtml {
        let htmlString = '';
        const typedLength = this.inputValue.length;
        const nextCharIndex = typedLength;

        for (let i = 0; i < typedLength; i++) {
            const char = this.targetWord[i];

            const isError = this.errorIndices.includes(i);
            const className = isError ? 'error-text' : 'correct-text';
            htmlString += `<span class="${className}">${char}</span>`;
        }

        const nextChar = this.targetWord.substring(
            nextCharIndex,
            nextCharIndex + 1
        );

        if (nextCharIndex < this.targetWord.length) {
            const isNextCharError = this.errorIndices.includes(nextCharIndex);

            const nextCharClassName = isNextCharError ? 'error-text' : 'next-char';

            htmlString += `<span class="${nextCharClassName}"><u>${nextChar}</u></span>`;

            const remainingPart = this.targetWord.substring(nextCharIndex + 1);
            htmlString += `<span>${remainingPart}</span>`;
        }

        return this.sanitizer.bypassSecurityTrustHtml(htmlString);
    }

    private _generateRandomTargetWord(numLetters: number, level: number): string {
        let result = '';

        const characters = this._getCumulativeCharacterSet(level);
        const charactersLength = characters.length;

        if (charactersLength === 0) {
            return 'Error: No characters available for this level.';
        }

        for (let i = 0; i < numLetters; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));

            if (i < numLetters - 1) {
                result += ' ';
            }
        }
        return result;
    }

    handleInputChange(): void {
        if (this.inputValue.length !== this.targetWord.length) {
            return
        }

        this.inputValue = '';

        if (
            this.errorIndices.length === 0 &&
            this.level < this.CHARACTER_SETS.length - 1
        ) {
            this.level++;
        }

        this.errorIndices = [];

        this.targetWord = this._generateRandomTargetWord(
            this.BLOCK_SIZE,
            this.level
        );
    }

    handleKeydown(event: KeyboardEvent): void {
        const currentLength = this.inputValue.length;
        const targetChar = this.targetWord.charAt(currentLength);
        const nextTargetChar = this.targetWord.charAt(currentLength + 1);
        const pressedKey = event.key;

        const isSelectAll = (
            (event.ctrlKey || event.metaKey) &&
            pressedKey.toLowerCase() === 'a'
        );

        if (isSelectAll) {
            event.preventDefault();
            return;
        }

        const isControlKey = (
            event.ctrlKey ||
            event.altKey ||
            event.metaKey ||
            ['ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'].includes(
                pressedKey
            )
        );

        if (isControlKey) {
            return;
        }

        if (
            pressedKey === 'Backspace' ||
            pressedKey === 'Delete'
        ) {
            event.preventDefault();
            return;
        }

        const isCharacterKey = pressedKey.length === 1 && pressedKey !== ' ';

        if (this.targetWord.length <= currentLength) {
            if (isCharacterKey || pressedKey === ' ') {
                event.preventDefault();
            }
            return;
        }

        if (pressedKey === ' ') {
            event.preventDefault();
            return;
        }

        const isCorrectLetter = (
            isCharacterKey &&
            pressedKey.toUpperCase() === targetChar.toUpperCase()
        );

        if (isCorrectLetter) {
            event.preventDefault();

            this.inputValue += targetChar;

            if (this.inputValue.length < this.targetWord.length && nextTargetChar === ' ') {
                this.inputValue += ' ';
            }

            const isWordCompleted = this.inputValue.length === this.targetWord.length;

            this.cdr.detectChanges();

            if (isWordCompleted) {
                setTimeout(() => {
                    this.handleInputChange();
                    this.cdr.detectChanges();
                }, 0);
            }

        } else if (isCharacterKey) {
            event.preventDefault();

            if (!this.errorIndices.includes(currentLength)) {
                this.errorIndices.push(currentLength);
                this.cdr.detectChanges();
            }
        }
    }
}
