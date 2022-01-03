import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteStub } from '@ngneat/spectator';
import { LoggerLevelEnum } from '../logger/logger.config';
import { BindGroupQueryParamDirective } from './bind-group-query-param.directive';
import { BindQueryParamOptions } from './bind-query-param.model';

@Component({
  template: `
    <form [formGroup]="form" [bindGroupQueryParam]="options" novalidate>
      <input formControlName="search" />
      <input formControlName="filter" />
    </form>
  `
})
class TestComponent {
  constructor(private readonly fb: FormBuilder) {}
  form = this.fb.group({
    search: [''],
    filter: [''],
    name: ['']
  });
  options: Partial<BindQueryParamOptions> = {
    formToQuery: true
  };
}

class MockRouter {
  navigateByUrl(url: string) {
    return url;
  }
  navigate = jasmine.createSpy('navigate');
}

describe('BindGroupQueryParamDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  const routeStub = new ActivatedRouteStub({ queryParams: { search: 'test', filter: 'toto', name: 'jojo' } });

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [BindGroupQueryParamDirective, TestComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: Router, useClass: MockRouter }
      ]
    }).createComponent(TestComponent);
  });

  it('formControls should be updated from query params', fakeAsync(() => {
    fixture.componentInstance.options = {
      formToQuery: true,
      exclude: ['name'],
      logger: { level: LoggerLevelEnum.none }
    };
    fixture.detectChanges();
    tick(300);
    expect(fixture.componentInstance.form.controls.search.value).toBe('test');
    expect(fixture.componentInstance.form.controls.filter.value).toBe('toto');
    expect(fixture.componentInstance.form.controls.name.value).toBe('');
  }));

  it('formControls should not be updated from query params', fakeAsync(() => {
    fixture.componentInstance.options = {
      formToQuery: true,
      include: [],
      logger: { level: LoggerLevelEnum.none }
    };
    fixture.detectChanges();
    tick(300);
    expect(fixture.componentInstance.form.controls.search.value).toBe('');
    expect(fixture.componentInstance.form.controls.filter.value).toBe('');
    expect(fixture.componentInstance.form.controls.name.value).toBe('');
  }));

  it('should call router navigation on formControl change', fakeAsync(() => {
    fixture.componentInstance.options = {
      formToQuery: true,
      exclude: ['name'],
      logger: { level: LoggerLevelEnum.none }
    };
    fixture.detectChanges();
    fixture.componentInstance.form.controls.search.patchValue('lala');
    tick(300);
    expect(TestBed.inject(Router).navigate).toHaveBeenCalled();
  }));

  it('should not call router navigation on formControl change', fakeAsync(() => {
    fixture.componentInstance.options = {
      formToQuery: true,
      exclude: ['name']
    };
    fixture.detectChanges();
    fixture.componentInstance.form.controls.name.patchValue('lala');
    tick(300);
    expect(TestBed.inject(Router).navigate).not.toHaveBeenCalled();
  }));
});
