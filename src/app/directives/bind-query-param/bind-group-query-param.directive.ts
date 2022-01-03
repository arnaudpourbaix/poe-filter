import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  debounceTime,
  filter,
  startWith,
  takeUntil,
  tap,
} from 'rxjs/operators';
import {
  BindQueryParamOptions,
  DEFAULT_BIND_QUERY_PARAM_OPTIONS,
} from './bind-query-param.model';

@Directive({
  selector: '[bindGroupQueryParam]',
})
export class BindGroupQueryParamDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input('bindGroupQueryParam')
  set _config(value: Partial<BindQueryParamOptions>) {
    this.config = {
      ...DEFAULT_BIND_QUERY_PARAM_OPTIONS,
      ...value,
    };
  }

  config: BindQueryParamOptions = DEFAULT_BIND_QUERY_PARAM_OPTIONS;
  control!: FormGroup;

  constructor(
    private ngControl: ControlContainer,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.control = this.ngControl?.control as FormGroup;
    this.initQueryToForm();
    this.initFormToQuery();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initQueryToForm() {
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$),
        filter(
          (queryParams) =>
            this.config.queryToForm && Object.keys(queryParams).length > 0
        ),
        tap((queryParams) => {
          let form = this.filterParams({
            incoming: this.config.formMapper(queryParams),
            current: this.control.value,
            action: 'queryToForm',
          });
          if (Object.keys(form).length) {
            this.control.patchValue(form);
          }
        })
      )
      .subscribe();
  }

  private initFormToQuery() {
    this.control.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        startWith(this.control.value),
        filter(() => this.config.formToQuery),
        debounceTime(this.config.debounceTime),
        tap((form) => {
          let queryParams = this.filterParams({
            incoming: this.config.queryParamsMapper(form),
            current: this.route.snapshot.queryParams,
            action: 'formToQuery',
          });
          if (Object.keys(queryParams).length) {
            this.router.navigate([], {
              relativeTo: this.route,
              replaceUrl: true,
              queryParams,
              queryParamsHandling: 'merge',
            });
          }
        })
      )
      .subscribe();
  }

  private filterParams(params: {
    incoming: { [key: string]: any };
    current: { [key: string]: any };
    action: string;
  }) {
    let result: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(params.incoming)) {
      const isExcluded =
        (!!this.config.exclude && this.config.exclude.includes(key)) ||
        (!!this.config.include && !this.config.include.includes(key));
      if (!isExcluded) {
        this.checkChange(result, {
          key,
          value,
          current: params.current[key],
          action: params.action,
        });
      }
    }
    return result;
  }

  private checkChange(
    result: { [key: string]: any },
    params: {
      key: string;
      value: any;
      current: { [key: string]: any };
      action: string;
    }
  ) {
    if (params.value != params.current) {
      result[params.key] = params.value;
    }
  }
}
