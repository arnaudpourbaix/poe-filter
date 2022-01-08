import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Params } from '@angular/router';
import { TypedFormGroup } from 'ngx-forms-typed';
import { debounceTime, map, startWith, switchMap } from 'rxjs';
import { BindQueryParamOptions } from 'src/app/directives/bind-query-param/bind-query-param.model';
import { ItemService } from 'src/app/services/item.service';
import { Item } from '../../models/item';
import { ItemView } from '../../models/section-model';

interface Form {
  name: string;
  class: string;
  armourTypes: boolean[];
  sortProperty: string;
}

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.scss'],
})
export class ItemSearchComponent {
  armourTypes = this.itemService.armourTypes;

  classes$ = this.itemService.getItems().pipe(
    map((items) => {
      const classes = items.reduce((acc, item) => {
        if (!acc.includes(item.class)) {
          acc.push(item.class);
        }
        return acc;
      }, [] as string[]);
      return classes.sort();
    })
  );

  sortProperties = ['name', 'requiredLevel'];

  form = this.fb.group({
    name: [''],
    class: [''],
    armourTypes: new FormArray(
      this.armourTypes.map(() => new FormControl(false))
    ),
    sortProperty: [this.sortProperties[0]],
  }) as TypedFormGroup<Form>;

  bindOptions: Partial<BindQueryParamOptions<Form>> = {
    formToQuery: true,
    debounceTime: 200,
    formMapper: (params: Params) => {
      return {
        name: params['name'],
        class: params['class'],
        armourTypes: this.queryParamsToForm(
          params['armourTypes'],
          this.form.controls.armourTypes.value.length
        ),
      };
    },
    queryParamsMapper: (form) => ({
      name: form.name,
      class: form.class,
      armourTypes: this.formToQueryParams(form.armourTypes ?? []),
    }),
  };

  items$ = this.form.valueChanges.pipe(
    debounceTime(200),
    startWith({}),
    switchMap(() => this.itemService.getItems()),
    map((items) => {
      const name = this.form.controls['name'].value;
      const clazz = this.form.controls['class'].value;
      const armourTypes = this.getSelection(
        this.form.value.armourTypes,
        this.armourTypes
      );
      const results = items
        .filter((item) => {
          const isArmour = [
            'Body Armours',
            'Boots',
            'Helmets',
            'Gloves',
            'Shields',
          ].includes(item.class);
          const matchName =
            !name || item.name.toLowerCase().toLowerCase().indexOf(name) !== -1;
          const matchClass = !clazz || clazz === item.class;
          const matchStr =
            armourTypes.includes('str') &&
            item.requiredStrength &&
            !item.requiredDexterity &&
            !item.requiredIntelligence;
          const matchDex =
            armourTypes.includes('dex') &&
            !item.requiredStrength &&
            item.requiredDexterity &&
            !item.requiredIntelligence;
          const matchInt =
            armourTypes.includes('int') &&
            !item.requiredStrength &&
            !item.requiredDexterity &&
            item.requiredIntelligence;
          const matchStrDex =
            armourTypes.includes('strDex') &&
            item.requiredStrength &&
            item.requiredDexterity &&
            !item.requiredIntelligence;
          const matchStrInt =
            armourTypes.includes('strInt') &&
            item.requiredStrength &&
            !item.requiredDexterity &&
            item.requiredIntelligence;
          const matchDexInt =
            armourTypes.includes('dexInt') &&
            !item.requiredStrength &&
            item.requiredDexterity &&
            item.requiredIntelligence;
          const matchArmour =
            !isArmour ||
            matchStr ||
            matchDex ||
            matchInt ||
            matchStrDex ||
            matchStrInt ||
            matchDexInt;
          return matchName && matchClass && matchArmour;
        })
        .sort(
          this.sortBy(
            (a) => a[this.form.controls.sortProperty.value as keyof Item]
          )
        );
      console.log(results);
      return results;
    })
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly itemService: ItemService
  ) {}

  private sortBy<T extends { [key: string]: any }>(
    key: string | ((obj: T) => any)
  ) {
    const getValue = (val: T) =>
      typeof key === 'string' ? val[key] : key(val);
    return (a: T, b: T) =>
      getValue(a) > getValue(b) ? 1 : getValue(b) > getValue(a) ? -1 : 0;
  }

  private queryParamsToForm(value: string, arrLength: number) {
    const values = value
      .split(',')
      .filter((v) => v.length)
      .map((v) => +v);
    const results = [];
    for (let i = 0; i < arrLength; i++) {
      results.push(values.includes(i));
    }
    return results;
  }

  private formToQueryParams(values: boolean[]) {
    const results = values
      .reduce((acc, v, i) => {
        if (v) acc.push(i);
        return acc;
      }, [] as number[])
      .join(',');
    return results;
  }

  private getSelection(selection: boolean[], items: ItemView[]) {
    return selection.reduce(
      (acc: string[], checked: boolean, i: number) =>
        checked ? [...acc, items[i].value] : acc,
      []
    );
  }
}
