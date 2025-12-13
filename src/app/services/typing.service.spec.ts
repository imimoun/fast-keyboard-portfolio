import { TestBed } from '@angular/core/testing';
import { TypingService } from './typing.service';

describe('TypingService', () => {
    let service: TypingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TypingService);
        service.level.set(0);
        service.inputValue.set('');
        service.errorIndices.set([]);
        (service as any)._generateNewTargetWord();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should initialize with a target word based on level 0', () => {
        const targetWord = service.targetWord();
        expect(targetWord.length).toBeGreaterThan(0);
        expect(service.level()).toBe(0);

        const allowedChars = "חכ ";
        const invalidChar = targetWord.split('').find(char => !allowedChars.includes(char));
        expect(invalidChar).toBeUndefined();
    });

    it('should correctly calculate the character set for level progression', () => {
        expect((service as any)._getCumulativeCharacterSet(0)).toBe("חכ");
        expect((service as any)._getCumulativeCharacterSet(1)).toBe("חכלג");
    });

    it('should append correct letter and space automatically', () => {
        const targetWord = service.targetWord();
        const firstChar = targetWord.charAt(0);
        const nextCharIsSpace = targetWord.charAt(1) === ' ';

        expect(targetWord.length).toBeGreaterThanOrEqual(3);
        expect(nextCharIsSpace).toBeTruthy();

        service.handleKeyPress(firstChar);

        expect(service.inputValue()).toBe(firstChar + ' ');

        const thirdChar = targetWord.charAt(2);
        service.handleKeyPress(thirdChar);

        expect(service.inputValue()).toBe(firstChar + ' ' + thirdChar + ' ');
    });

    it('should register an error index when a wrong key is pressed', () => {
        const initialLength = service.inputValue().length;

        service.handleKeyPress('z');

        expect(service.errorIndices()).toEqual([0]);
        expect(service.inputValue().length).toBe(initialLength);

        service.handleKeyPress('y');

        expect(service.errorIndices()).toEqual([0]);
    });

    it('should ignore key press if target word is already completed', () => {
        const targetWord = service.targetWord();
        service.inputValue.set(targetWord);

        service.handleKeyPress('a');

        expect(service.inputValue()).toBe(targetWord);
    });

    it('should return correct current level name/chars', () => {
        service.level.set(1);
        expect(service.currentLevelName).toBe('Level 2');
        expect(service.currentLevelCharacterSet).toBe('לג');
    });

    it('should return correct previous level name/chars when level > 0', () => {
        service.level.set(1);
        expect(service.previousLevelName).toBe('Level 1');
        expect(service.previousLevelCharacterSet).toBe('חכ');
    });

    it('should return N/A for previous level when level is 0', () => {
        service.level.set(0);
        expect(service.previousLevelName).toBe('N/A');
        expect(service.previousLevelCharacterSet).toBe('N/A');
    });

    it('should return correct next level name/chars when not at max level', () => {
        service.level.set(0);
        expect(service.nextLevelName).toBe('Level 2');
        expect(service.nextLevelCharacterSet).toBe('לג');
    });

    it('should return N/A for next level when at max level', () => {
        const maxLevel = service['CHARACTER_SETS'].length - 1;
        service.level.set(maxLevel);
        expect(service.nextLevelName).toBe('N/A');
        expect(service.nextLevelCharacterSet).toBe('N/A');
    });
});
