import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LevelInfoComponent } from './level-info.component';
import { TypingService } from '../../services/typing.service';

describe('LevelInfoComponent', () => {
    let component: LevelInfoComponent;
    let fixture: ComponentFixture<LevelInfoComponent>;
    let mockTypingService: Partial<TypingService>;

    beforeEach(async () => {
        mockTypingService = {
            previousLevelName: 'Level 1',
            previousLevelCharacterSet: 'חכ',
            currentLevelName: 'Level 2',
            currentLevelCharacterSet: 'לג',
            nextLevelName: 'Level 3',
            nextLevelCharacterSet: 'ךד',
        };

        await TestBed.configureTestingModule({
            imports: [LevelInfoComponent],
            providers: [
                { provide: TypingService, useValue: mockTypingService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LevelInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the previous level information', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const previousLevelCell = compiled.querySelectorAll('td')[0];

        expect(previousLevelCell.innerHTML).toContain('Level 1');
        expect(previousLevelCell.innerHTML).toContain('חכ');
    });

    it('should display the current level information', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const currentLevelCell = compiled.querySelectorAll('td')[1];

        expect(currentLevelCell.innerHTML).toContain('Level 2');
        expect(currentLevelCell.innerHTML).toContain('לג');
    });

    it('should display the next level information', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const nextLevelCell = compiled.querySelectorAll('td')[2];

        expect(nextLevelCell.innerHTML).toContain('Level 3');
        expect(nextLevelCell.innerHTML).toContain('ךד');
    });

    it('should display the correct headers', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const headers = compiled.querySelectorAll('th');

        expect(headers[0].textContent).toContain('Previous Level');
        expect(headers[1].textContent).toContain('Current Level');
        expect(headers[2].textContent).toContain('Next Level');
    });
});