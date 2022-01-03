import { Component, Input, OnInit } from '@angular/core';
import { TypedFormGroup } from 'ngx-forms-typed';
import { ItemView, SectionForm } from 'src/app/models/section-model';
import { ItemSocket } from 'src/app/models/socket';
import { ItemService } from 'src/app/services/item.service';
import { SectionConfig } from './section-config';

@Component({
  selector: 'app-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.scss'],
})
export class FilterSectionComponent implements OnInit {
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
  }
}
