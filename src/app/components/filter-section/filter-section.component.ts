import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TypedFormGroup } from 'ngx-forms-typed';
import { Subject, takeUntil, tap } from 'rxjs';
import { ItemView, SectionForm } from 'src/app/models/section-model';
import { ItemSocket } from 'src/app/models/socket';
import { ItemService } from 'src/app/services/item.service';
import { SectionConfig } from './section-config';

@Component({
  selector: 'app-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.scss'],
})
export class FilterSectionComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();

  @Input()
  title!: string;

  @Input()
  items!: ItemView[];

  @Input()
  form!: TypedFormGroup<SectionForm>;

  @Input()
  config!: SectionConfig;

  sockets!: ItemSocket[];
  links!: number[];
  sizes = this.itemService.sizes;

  constructor(private readonly itemService: ItemService) {}

  ngOnInit(): void {
    this.sockets = this.itemService.sockets.slice(0, this.config.sockets);
    this.links = this.itemService.links.slice(0, this.config.sockets);
    this.form.controls.minSockets.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap((value) => {
          if (value > this.form.controls.sockets.value) {
            this.form.controls.sockets.setValue(value);
          }
        })
      )
      .subscribe();
    this.form.controls.minLinks.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        tap((value) => {
          if (value > this.form.controls.links.value) {
            this.form.controls.links.setValue(value);
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(void 0);
    this.destroy$.complete();
  }
}
