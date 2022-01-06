import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Params } from '@angular/router';
import { debounceTime, map, switchMap } from 'rxjs';
import { BindQueryParamOptions } from 'src/app/directives/bind-query-param/bind-query-param.model';
import { ItemService } from 'src/app/services/item.service';

interface Form {
  name: string;
  class: string;
  str: boolean;
  dex: boolean;
  int: boolean;
  strDex: boolean;
  strInt: boolean;
  dexInt: boolean;
}

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.scss'],
})
export class ItemSearchComponent {
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

  form = this.fb.group({
    name: [''],
    class: [''],
    str: [true],
    dex: [true],
    int: [true],
    strDex: [true],
    strInt: [true],
    dexInt: [true],
  });

  bindOptions: Partial<BindQueryParamOptions<Form>> = {
    formToQuery: true,
    debounceTime: 200,
    formMapper: (params: Params) => {
      return {
        name: params['name'],
        class: params['class'],
        str: params['str'] === 'true',
        dex: params['dex'] === 'true',
        int: params['int'] === 'true',
        strDex: params['strDex'] === 'true',
        strInt: params['strInt'] === 'true',
        dexInt: params['dexInt'] === 'true',
      };
    },
    queryParamsMapper: (form) => ({
      name: form.name,
      class: form.class,
      str: form.str,
      dex: form.dex,
      int: form.int,
      strDex: form.strDex,
      strInt: form.strInt,
      dexInt: form.dexInt,
    }),
  };

  items$ = this.form.valueChanges.pipe(
    debounceTime(200),
    switchMap(() => this.itemService.getItems()),
    map((items) => {
      const name = this.form.controls['name'].value;
      const clazz = this.form.controls['class'].value;
      const str = this.form.controls['str'].value;
      const dex = this.form.controls['dex'].value;
      const int = this.form.controls['int'].value;
      const strDex = this.form.controls['strDex'].value;
      const strInt = this.form.controls['strInt'].value;
      const dexInt = this.form.controls['dexInt'].value;
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
            str &&
            item.requiredStrength &&
            !item.requiredDexterity &&
            !item.requiredIntelligence;
          const matchDex =
            dex &&
            !item.requiredStrength &&
            item.requiredDexterity &&
            !item.requiredIntelligence;
          const matchInt =
            int &&
            !item.requiredStrength &&
            !item.requiredDexterity &&
            item.requiredIntelligence;
          const matchStrDex =
            strDex &&
            item.requiredStrength &&
            item.requiredDexterity &&
            !item.requiredIntelligence;
          const matchStrInt =
            strInt &&
            item.requiredStrength &&
            !item.requiredDexterity &&
            item.requiredIntelligence;
          const matchDexInt =
            dexInt &&
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
        //.sort((a, b) => a.dropLevel - b.dropLevel);
        .sort(this.sortBy((a) => a.name));
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
}
