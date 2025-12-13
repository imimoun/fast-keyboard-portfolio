import { TestBed, ComponentFixture } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
    let fixture: ComponentFixture<App>;
    let component: App;
    let compiled: HTMLElement;

    beforeEach(async () => {
        fixture = TestBed.createComponent(App);
        component = fixture.componentInstance;

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
});
