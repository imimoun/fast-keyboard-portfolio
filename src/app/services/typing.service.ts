import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class TypingService {
    private readonly BLOCK_SIZE: number = 20;
    private readonly LEVEL_PREFIX: string = 'Level ';

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

    public level = signal<number>(0);
    public inputValue = signal<string>('');
    public targetWord = signal<string>('');
    public errorIndices = signal<number[]>([]);

    constructor() {
        this._generateNewTargetWord();
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

    private _generateNewTargetWord(): void {
        this.targetWord.set(
            this._generateRandomTargetWord(this.BLOCK_SIZE, this.level())
        );
    }

    public get previousLevelName(): string {
        if (this.level() > 0) {
            return this.LEVEL_PREFIX + this.level();
        }
        return 'N/A';
    }

    public get previousLevelCharacterSet(): string {
        if (1 <= this.level()) {
            return this.CHARACTER_SETS[this.level() - 1];
        }
        return 'N/A';
    }

    public get currentLevelName(): string {
        return this.LEVEL_PREFIX + (this.level() + 1);
    }

    public get currentLevelCharacterSet(): string {
        return this.CHARACTER_SETS[this.level()];
    }

    public get nextLevelName(): string {
        if (this.level() < this.CHARACTER_SETS.length - 1) {
            return this.LEVEL_PREFIX + (this.level() + 2);
        }
        return 'N/A';
    }

    public get nextLevelCharacterSet(): string {
        if (this.level() < this.CHARACTER_SETS.length - 1) {
            return this.CHARACTER_SETS[this.level() + 1];
        }
        return 'N/A';
    }

    public handleKeyPress(pressedKey: string): void {
        const currentLength = this.inputValue().length;
        const targetChar = this.targetWord().charAt(currentLength);
        const nextTargetChar = this.targetWord().charAt(currentLength + 1);

        if (this.targetWord().length <= currentLength) {
            return;
        }

        const isCorrectLetter = (
            pressedKey.length === 1 &&
            pressedKey.toUpperCase() === targetChar.toUpperCase()
        );

        if (isCorrectLetter) {
            let newInput = this.inputValue() + targetChar;

            if (
                newInput.length < this.targetWord().length &&
                nextTargetChar === ' '
            ) {
                newInput += ' ';
            }

            this.inputValue.set(newInput);

            if (this.inputValue().length === this.targetWord().length) {
                setTimeout(() => this.resetTyping(), 0);
            }
        } else if (pressedKey.length === 1 && pressedKey !== ' ') {
            if (!this.errorIndices().includes(currentLength)) {
                this.errorIndices.update(errors => [...errors, currentLength]);
            }
        }
    }

    private resetTyping(): void {
        const errors = this.errorIndices();
        const currentLevel = this.level();

        if (
            errors.length === 0 &&
            currentLevel < this.CHARACTER_SETS.length - 1
        ) {
            this.level.set(currentLevel + 1);
        }

        this.inputValue.set('');
        this.errorIndices.set([]);
        this._generateNewTargetWord();
    }
}
