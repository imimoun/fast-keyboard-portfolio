import { TestBed, ComponentFixture } from '@angular/core/testing';
import { App } from './app';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
class MockDomSanitizer extends DomSanitizer {
    bypassSecurityTrustHtml(value: string): any { return value; }
    bypassSecurityTrustStyle(value: string): any { return value; }
    bypassSecurityTrustScript(value: string): any { return value; }
    bypassSecurityTrustUrl(value: string): any { return value; }
    bypassSecurityTrustResourceUrl(value: string): any { return value; }
    sanitize(context: any, value: any): string { return value; }
}

class MockChangeDetectorRef {
    detectChanges(): void {}
}

describe('App', () => {
    let fixture: ComponentFixture<App>;
    let component: App;
    let compiled: HTMLElement;

    let characterSets: string[];

    let maxLevelIndex: number;

    const getCumulativeSet = (level: number): string =>
        (component as any)['_getCumulativeCharacterSet'](level);

    const generateRandomTargetWord = (numLetters: number, level: number): string =>
        (component as any)['_generateRandomTargetWord'](numLetters, level);

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [App],

            providers: [
                { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
                { provide: DomSanitizer, useClass: MockDomSanitizer }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(App);
        component = fixture.componentInstance;

        characterSets = (component as any)['CHARACTER_SETS'] as string[];

        maxLevelIndex = characterSets.length - 1;

        fixture.detectChanges();
        compiled = fixture.nativeElement as HTMLElement;
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('should render the heading', () => {
        expect(compiled.querySelector('h1')?.textContent).toContain('Keyboard Typing Training');
    });

    it('should render the initial input value in the paragraph', () => {
        expect(compiled.querySelector('p')?.textContent).toContain(`Type the text below:`);
    });

    describe('_getCumulativeCharacterSet', () => {
        it('should return the character set for level 0 only', () => {
            const result = getCumulativeSet(0);
            expect(result).toEqual('חכ');
        });

        it('should return the cumulative character set for level 1 (Level 0 + Level 1)', () => {
            const result = getCumulativeSet(1);
            expect(result).toEqual('חכלג');
        });

        it('should return the cumulative character set for level 3 (Level 0 through Level 3)', () => {
            const result = getCumulativeSet(3);
            expect(result).toEqual('חכלגךדףש');
        });

        it('should return the full character set for the maximum level', () => {
            const expectedFullSet = "חכלגךדףשיעורןקםפטאצהתבץס.זמנ,";
            const result = getCumulativeSet(maxLevelIndex);
            expect(result).toEqual(expectedFullSet);
        });

        it('should return an empty string for a negative level index', () => {
            const result = getCumulativeSet(-1);
            expect(result).toEqual('');
        });

        it('should return an empty string for an index out of bounds (too high)', () => {
            const result = getCumulativeSet(maxLevelIndex + 1);
            expect(result).toEqual('');
        });
    });

    describe('previousLevelName', () => {
        it('should return "N/A" when the current level is 0', () => {
            component.level = 0;
            expect(component.previousLevelName).toEqual('N/A');
        });

        it('should return "Level 1" when the current level is 1', () => {
            component.level = 1;
            expect(component.previousLevelName).toEqual('Level 1');
        });

        it('should return "Level 5" when the current level is 5', () => {
            component.level = 5;
            expect(component.previousLevelName).toEqual('Level 5');
        });

        it('should return the correct level number (max level in code is 15)', () => {
            component.level = maxLevelIndex;
            expect(component.previousLevelName).toEqual('Level 15');
        });
    });

    describe('previousLevelCharacterSet', () => {
        it('should return "N/A" when the current level is 0 (the first level)', () => {
            component.level = 0;
            expect(component.previousLevelCharacterSet).toEqual('N/A');
        });

        it('should return the set of CHARACTER_SETS[0] when the current level is 1', () => {
            component.level = 1;

            expect(component.previousLevelCharacterSet).toEqual(characterSets[0]);
            expect(component.previousLevelCharacterSet).toEqual('חכ');
        });

        it('should return the set of CHARACTER_SETS[4] when the current level is 5', () => {
            component.level = 5;

            expect(component.previousLevelCharacterSet).toEqual(characterSets[4]);
            expect(component.previousLevelCharacterSet).toEqual('יע');
        });

        it('should return the set of CHARACTER_SETS[14] when the current level is the max level (15)', () => {
            component.level = maxLevelIndex;

            expect(component.previousLevelCharacterSet).toEqual(characterSets[14]);
            expect(component.previousLevelCharacterSet).toEqual('מנ');
        });
    });

    describe('currentLevelName', () => {
        it('should return "Level 1" when the current level (index) is 0', () => {
            component.level = 0;

            expect(component.currentLevelName).toEqual('Level 1');
        });

        it('should return "Level 5" when the current level (index) is 4', () => {
            component.level = 4;

            expect(component.currentLevelName).toEqual('Level 5');
        });

        it('should return the correct name for the max level (index 15)', () => {
            component.level = maxLevelIndex;

            expect(component.currentLevelName).toEqual('Level 16');
        });
    });

    describe('currentLevelCharacterSet', () => {
        it('should return the set of CHARACTER_SETS[0] when the current level is 0', () => {
            component.level = 0;

            expect(component.currentLevelCharacterSet).toEqual(characterSets[0]);
            expect(component.currentLevelCharacterSet).toEqual('חכ');
        });

        it('should return the set of CHARACTER_SETS[5] when the current level is 5', () => {
            component.level = 5;

            expect(component.currentLevelCharacterSet).toEqual(characterSets[5]);
            expect(component.currentLevelCharacterSet).toEqual('ור');
        });

        it('should return the set of CHARACTER_SETS[15] when the current level is the max level (15)', () => {
            component.level = maxLevelIndex;

            expect(component.currentLevelCharacterSet).toEqual(characterSets[maxLevelIndex]);
            expect(component.currentLevelCharacterSet).toEqual(',');
        });
    });

    describe('nextLevelName', () => {
        it('should return "Level 2" when the current level (index) is 0', () => {
            component.level = 0;

            expect(component.nextLevelName).toEqual('Level 2');
        });

        it('should return "Level 6" when the current level (index) is 4', () => {
            component.level = 4;

            expect(component.nextLevelName).toEqual('Level 6');
        });

        it('should return "Level 16" when the current level is one before the max (index 14)', () => {
            component.level = maxLevelIndex - 1;

            expect(component.nextLevelName).toEqual('Level 16');
        });

        it('should return "N/A" when the current level is the max level (index 15)', () => {
            component.level = maxLevelIndex;
            expect(component.nextLevelName).toEqual('N/A');
        });
    });

    describe('nextLevelCharacterSet', () => {
        it('should return the set of CHARACTER_SETS[1] when the current level is 0', () => {
            component.level = 0;

            expect(component.nextLevelCharacterSet).toEqual(characterSets[1]);
            expect(component.nextLevelCharacterSet).toEqual('לג');
        });

        it('should return the set of CHARACTER_SETS[6] when the current level is 5', () => {
            component.level = 5;

            expect(component.nextLevelCharacterSet).toEqual(characterSets[6]);
            expect(component.nextLevelCharacterSet).toEqual('ןק');
        });

        it('should return the set of CHARACTER_SETS[15] when the current level is one before the max (index 14)', () => {
            component.level = maxLevelIndex - 1;

            expect(component.nextLevelCharacterSet).toEqual(characterSets[maxLevelIndex]);
            expect(component.nextLevelCharacterSet).toEqual(',');
        });

        it('should return "N/A" when the current level is the max level (index 15)', () => {
            component.level = maxLevelIndex;
            expect(component.nextLevelCharacterSet).toEqual('N/A');
        });
    });

    describe('getHighlightedTargetWordHtml', () => {
        beforeEach(() => {
            component.targetWord = 'abc de fgh';
            component.inputValue = '';
            component.errorIndices = [];
        });

        it('should highlight the first character with an underline when no text is typed', () => {
            component.inputValue = '';

            const expectedHtml = '<span class="next-char"><u>a</u></span><span>bc de fgh</span>';
            expect(component.getHighlightedTargetWordHtml()).toEqual(expectedHtml);
        });

        it('should highlight typed characters as correct, underline the next char, and keep the rest as plain span', () => {
            component.inputValue = 'abc';

            component.targetWord = 'abc de fgh';

            const expectedHtml = '<span class="correct-text">a</span><span class="correct-text">b</span><span class="correct-text">c</span><span class="next-char"><u> </u></span><span>de fgh</span>';
            expect(component.getHighlightedTargetWordHtml()).toEqual(expectedHtml);
        });

        it('should highlight correct, error, underline next char, and keep the rest as plain span', () => {
            component.inputValue = 'abc';
            component.errorIndices = [1];
            component.targetWord = 'abc de fgh';

            const expectedHtml = '<span class="correct-text">a</span><span class="error-text">b</span><span class="correct-text">c</span><span class="next-char"><u> </u></span><span>de fgh</span>';
            expect(component.getHighlightedTargetWordHtml()).toEqual(expectedHtml);
        });

        it('should highlight the next char with "error-text" class and underline if it has been flagged as an error', () => {
            component.inputValue = 'ab';
            component.errorIndices = [2];
            component.targetWord = 'abc de fgh';

            const expectedHtml = '<span class="correct-text">a</span><span class="correct-text">b</span><span class="error-text"><u>c</u></span><span> de fgh</span>';
            expect(component.getHighlightedTargetWordHtml()).toEqual(expectedHtml);
        });

        it('should show all characters as correct once the word is fully typed without errors', () => {
            component.inputValue = 'abc de fgh';
            component.errorIndices = [];

            const expectedHtml = '<span class="correct-text">a</span><span class="correct-text">b</span><span class="correct-text">c</span><span class="correct-text"> </span><span class="correct-text">d</span><span class="correct-text">e</span><span class="correct-text"> </span><span class="correct-text">f</span><span class="correct-text">g</span><span class="correct-text">h</span>';
            expect(component.getHighlightedTargetWordHtml()).toEqual(expectedHtml);
        });
    });

    describe('_generateRandomTargetWord', () => {
        const NUM_LETTERS = 5;

        const EXPECTED_LENGTH = 9;

        it('should generate a string of the correct length (5 letters and 4 spaces)', () => {
            const result = generateRandomTargetWord(NUM_LETTERS, 0);
            expect(result.length).toEqual(EXPECTED_LENGTH);
            expect(result.split(' ').length - 1).toEqual(NUM_LETTERS - 1);
        });

        it('should contain only characters from the cumulative set for level 0', () => {
            const cumulativeSet = getCumulativeSet(0);
            const allowedCharsRegex = new RegExp(`^[${cumulativeSet} ]+$`);

            for (let i = 0; i < 20; i++) {
                const result = generateRandomTargetWord(NUM_LETTERS, 0);
                expect(result).toMatch(allowedCharsRegex);
            }
        });

        it('should contain only characters from the cumulative set for level 4 (index 3)', () => {
            const levelIndex = 3;
            const cumulativeSet = getCumulativeSet(levelIndex);
            const allowedCharsRegex = new RegExp(`^[${cumulativeSet} ]+$`);

            for (let i = 0; i < 20; i++) {
                const result = generateRandomTargetWord(NUM_LETTERS, levelIndex);
                expect(result).toMatch(allowedCharsRegex);
            }
        });

        it('should generate a word composed of characters from the FULL cumulative set for the max level', () => {
            const cumulativeSet = getCumulativeSet(maxLevelIndex);
            const allowedCharsRegex = new RegExp(`^[${cumulativeSet} ]+$`);

            for (let i = 0; i < 20; i++) {
                const result = generateRandomTargetWord(NUM_LETTERS, maxLevelIndex);
                expect(result).toMatch(allowedCharsRegex);
            }
        });

        it('should return the error string if the cumulative character set is empty (e.g., invalid level)', () => {
            const result = generateRandomTargetWord(NUM_LETTERS, -1);
            expect(result).toEqual('Error: No characters available for this level.');
        });

        it('should generate a word that is exactly one letter long (with no space) when numLetters is 1', () => {
            const result = generateRandomTargetWord(1, 0);
            expect(result.length).toEqual(1);
            expect(result).not.toContain(' ');
        });

        it('should generate an empty string (or handle gracefully) when numLetters is 0', () => {
            const result = generateRandomTargetWord(0, 0);
            expect(result).toEqual('');
        });
    });
});
