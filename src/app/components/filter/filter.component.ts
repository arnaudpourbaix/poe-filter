import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Params } from '@angular/router';
import { TypedFormGroup } from 'ngx-forms-typed';
import { map, of } from 'rxjs';
import { BindQueryParamOptions } from 'src/app/directives/bind-query-param/bind-query-param.model';
import { ItemView, SectionForm } from 'src/app/models/section-model';
import { FilterService } from 'src/app/services/filter.service';
import { ItemService } from 'src/app/services/item.service';
import { SectionConfig } from '../filter-section/section-config';

interface Form {
  oneHandWeapons: SectionForm;
  twoHandWeapons: SectionForm;
  bodyArmours: SectionForm;
  helmets: SectionForm;
  boots: SectionForm;
  gloves: SectionForm;
  shields: SectionForm;
  flasks: SectionForm;
  belts: boolean[];
  rings: boolean[];
  amulets: boolean[];
  minQualityRecipe: number;
  chromatics: boolean[];
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  armours = this.itemService.armourTypes;
  oneHandWeapons = this.itemService.oneHandWeapons.map(
    (a) => ({ value: a, label: a } as ItemView)
  );
  twoHandWeapons = this.itemService.twoHandWeapons.map(
    (a) => ({ value: a, label: a } as ItemView)
  );
  flasks = this.itemService.flasks.map(
    (a) => ({ value: a, label: a } as ItemView)
  );
  sizes = [...this.itemService.sizes].filter((i) => i.chromatic);

  belts = this.itemService.belts.map(
    (a) => ({ value: a, label: a } as ItemView)
  );
  amulets = this.itemService.amulets.map(
    (a) => ({ value: a, label: a } as ItemView)
  );
  rings = this.itemService.rings.map(
    (a) => ({ value: a, label: a } as ItemView)
  );

  qualities = this.itemService.qualities;

  oneHandWeaponsConfig: SectionConfig = {
    sockets: 3,
  };
  twoHandWeaponsConfig: SectionConfig = {
    sockets: 6,
  };
  bodyArmoursConfig: SectionConfig = {
    sockets: 6,
  };
  helmetsConfig: SectionConfig = {
    sockets: 4,
  };
  glovesConfig: SectionConfig = {
    sockets: 4,
  };
  bootsConfig: SectionConfig = {
    sockets: 4,
  };
  shieldsConfig: SectionConfig = {
    sockets: 3,
  };
  flaskConfig: SectionConfig = {
    sockets: 0,
  };

  script$ = of('');

  form = this.fb.group({
    oneHandWeapons: this.fb.group({
      selection: new FormArray(
        this.oneHandWeapons.map(() => new FormControl(false))
      ),
      minSockets: [1],
      minLinks: [0],
      minSocketsHighlight: [false],
      minLinksHighlight: [false],
    }),
    twoHandWeapons: this.fb.group({
      selection: new FormArray(
        this.twoHandWeapons.map(() => new FormControl(false))
      ),
      minSockets: [1],
      minLinks: [0],
      minSocketsHighlight: [false],
      minLinksHighlight: [false],
    }),
    bodyArmours: this.fb.group({
      selection: new FormArray(this.armours.map(() => new FormControl(false))),
      minSockets: [3],
      minLinks: [3],
      minSocketsHighlight: [false],
      minLinksHighlight: [false],
    }),
    helmets: this.fb.group({
      selection: new FormArray(this.armours.map(() => new FormControl(false))),
      minSockets: [1],
      minLinks: [0],
      minSocketsHighlight: [false],
      minLinksHighlight: [false],
    }),
    gloves: this.fb.group({
      selection: new FormArray(this.armours.map(() => new FormControl(false))),
      minSockets: [1],
      minLinks: [0],
      minSocketsHighlight: [false],
      minLinksHighlight: [false],
    }),
    boots: this.fb.group({
      selection: new FormArray(this.armours.map(() => new FormControl(false))),
      minSockets: [1],
      minLinks: [0],
      minSocketsHighlight: [false],
      minLinksHighlight: [false],
    }),
    shields: this.fb.group({
      selection: new FormArray(this.armours.map(() => new FormControl(false))),
      minSockets: [1],
      minLinks: [0],
      minSocketsHighlight: [false],
      minLinksHighlight: [false],
    }),
    flasks: this.fb.group({
      selection: new FormArray(this.flasks.map(() => new FormControl(false))),
      minSockets: [0],
      minLinks: [0],
      minSocketsHighlight: [false],
      minLinksHighlight: [false],
    }),
    amulets: new FormArray(this.amulets.map(() => new FormControl(true))),
    rings: new FormArray(this.rings.map(() => new FormControl(true))),
    belts: new FormArray(this.belts.map(() => new FormControl(true))),
    chromatics: new FormArray(this.sizes.map(() => new FormControl(true))),
    minQualityRecipe: [5],
  }) as TypedFormGroup<Form>;

  bindOptions: Partial<BindQueryParamOptions<Form>> = {
    formToQuery: true,
    debounceTime: 200,
    formMapper: (params: Params) => {
      return {
        oneHandWeapons: {
          selection: this.queryParamsToForm(
            params['a'],
            this.form.controls.oneHandWeapons.value.selection.length
          ),
          minSockets: +params['aa'],
          minLinks: +params['ab'],
          minSocketsHighlight: params['ac'] === 'true',
          minLinksHighlight: params['ad'] === 'true',
        },
        twoHandWeapons: {
          selection: this.queryParamsToForm(
            params['b'],
            this.form.controls.twoHandWeapons.value.selection.length
          ),
          minSockets: +params['ba'],
          minLinks: +params['bb'],
          minSocketsHighlight: params['bc'] === 'true',
          minLinksHighlight: params['bd'] === 'true',
        },
        bodyArmours: {
          selection: this.queryParamsToForm(
            params['c'],
            this.form.controls.bodyArmours.value.selection.length
          ),
          minSockets: +params['ca'],
          minLinks: +params['cb'],
          minSocketsHighlight: params['cc'] === 'true',
          minLinksHighlight: params['cd'] === 'true',
        },
        helmets: {
          selection: this.queryParamsToForm(
            params['d'],
            this.form.controls.helmets.value.selection.length
          ),
          minSockets: +params['da'],
          minLinks: +params['db'],
          minSocketsHighlight: params['dc'] === 'true',
          minLinksHighlight: params['dd'] === 'true',
        },
        boots: {
          selection: this.queryParamsToForm(
            params['e'],
            this.form.controls.gloves.value.selection.length
          ),
          minSockets: +params['ea'],
          minLinks: +params['eb'],
          minSocketsHighlight: params['ec'] === 'true',
          minLinksHighlight: params['ed'] === 'true',
        },
        gloves: {
          selection: this.queryParamsToForm(
            params['f'],
            this.form.controls.boots.value.selection.length
          ),
          minSockets: +params['fa'],
          minLinks: +params['fb'],
          minSocketsHighlight: params['fc'] === 'true',
          minLinksHighlight: params['fd'] === 'true',
        },
        shields: {
          selection: this.queryParamsToForm(
            params['g'],
            this.form.controls.helmets.value.selection.length
          ),
          minSockets: +params['ga'],
          minLinks: +params['gb'],
          minSocketsHighlight: params['gc'] === 'true',
          minLinksHighlight: params['gd'] === 'true',
        },
        flasks: {
          selection: this.queryParamsToForm(
            params['h'],
            this.form.controls.flasks.value.selection.length
          ),
        } as SectionForm,
        chromatics: this.queryParamsToForm(
          params['i'],
          this.form.controls.chromatics.value.length
        ),
        minQualityRecipe: +params['j'],
        belts: this.queryParamsToForm(
          params['k'],
          this.form.controls.belts.value.length
        ),
        amulets: this.queryParamsToForm(
          params['l'],
          this.form.controls.amulets.value.length
        ),
        rings: this.queryParamsToForm(
          params['m'],
          this.form.controls.rings.value.length
        ),
      };
    },
    queryParamsMapper: (form) => {
      return {
        a: this.formToQueryParams(form.oneHandWeapons?.selection ?? []),
        aa: form.oneHandWeapons?.minSockets,
        ab: form.oneHandWeapons?.minLinks,
        ac: form.oneHandWeapons?.minSocketsHighlight,
        ad: form.oneHandWeapons?.minLinksHighlight,
        b: this.formToQueryParams(form.twoHandWeapons?.selection ?? []),
        ba: form.twoHandWeapons?.minSockets,
        bb: form.twoHandWeapons?.minLinks,
        bc: form.twoHandWeapons?.minSocketsHighlight,
        bd: form.twoHandWeapons?.minLinksHighlight,
        c: this.formToQueryParams(form.bodyArmours?.selection ?? []),
        ca: form.bodyArmours?.minSockets,
        cb: form.bodyArmours?.minLinks,
        cc: form.bodyArmours?.minSocketsHighlight,
        cd: form.bodyArmours?.minLinksHighlight,
        d: this.formToQueryParams(form.helmets?.selection ?? []),
        da: form.helmets?.minSockets,
        db: form.helmets?.minLinks,
        dc: form.helmets?.minSocketsHighlight,
        dd: form.helmets?.minLinksHighlight,
        e: this.formToQueryParams(form.boots?.selection ?? []),
        ea: form.boots?.minSockets,
        eb: form.boots?.minLinks,
        ec: form.boots?.minSocketsHighlight,
        ed: form.boots?.minLinksHighlight,
        f: this.formToQueryParams(form.gloves?.selection ?? []),
        fa: form.gloves?.minSockets,
        fb: form.gloves?.minLinks,
        fc: form.gloves?.minSocketsHighlight,
        fd: form.gloves?.minLinksHighlight,
        g: this.formToQueryParams(form.shields?.selection ?? []),
        ga: form.shields?.minSockets,
        gb: form.shields?.minLinks,
        gc: form.shields?.minSocketsHighlight,
        gd: form.shields?.minLinksHighlight,
        h: this.formToQueryParams(form.flasks?.selection ?? []),
        i: this.formToQueryParams(form.chromatics ?? []),
        j: form.minQualityRecipe,
        k: this.formToQueryParams(form.belts ?? []),
        l: this.formToQueryParams(form.amulets ?? []),
        m: this.formToQueryParams(form.rings ?? []),
      };
    },
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly itemService: ItemService,
    private readonly filterService: FilterService
  ) {}

  ngOnInit(): void {}

  get oneHandWeaponsForm() {
    return this.form.controls.oneHandWeapons as TypedFormGroup<SectionForm>;
  }
  get twoHandWeaponsForm() {
    return this.form.controls.twoHandWeapons as TypedFormGroup<SectionForm>;
  }
  get bodyArmoursForm() {
    return this.form.controls.bodyArmours as TypedFormGroup<SectionForm>;
  }
  get helmetsForm() {
    return this.form.controls.helmets as TypedFormGroup<SectionForm>;
  }
  get glovesForm() {
    return this.form.controls.gloves as TypedFormGroup<SectionForm>;
  }
  get bootsForm() {
    return this.form.controls.boots as TypedFormGroup<SectionForm>;
  }
  get shieldsForm() {
    return this.form.controls.shields as TypedFormGroup<SectionForm>;
  }
  get flasksForm() {
    return this.form.controls.flasks as TypedFormGroup<SectionForm>;
  }

  generate() {
    const form = this.form.value;
    this.script$ = this.filterService
      .generate({
        minQualityRecipe: form.minQualityRecipe,
        oneHandWeapons: {
          classes: this.getSelection(
            form.oneHandWeapons.selection,
            this.oneHandWeapons
          ),
          minSockets: form.oneHandWeapons.minSockets,
          minLinks: form.oneHandWeapons.minLinks,
          minSocketsHighlight: form.oneHandWeapons.minSocketsHighlight,
          minLinksHighlight: form.oneHandWeapons.minLinksHighlight,
        },
        twoHandWeapons: {
          classes: this.getSelection(
            form.twoHandWeapons.selection,
            this.twoHandWeapons
          ),
          minSockets: form.twoHandWeapons.minSockets,
          minLinks: form.twoHandWeapons.minLinks,
          minSocketsHighlight: form.twoHandWeapons.minSocketsHighlight,
          minLinksHighlight: form.twoHandWeapons.minLinksHighlight,
        },
        bodyArmours: {
          types: this.getSelection(form.bodyArmours.selection, this.armours),
          minSockets: form.bodyArmours.minSockets,
          minLinks: form.bodyArmours.minLinks,
          minSocketsHighlight: form.bodyArmours.minSocketsHighlight,
          minLinksHighlight: form.bodyArmours.minLinksHighlight,
        },
        helmets: {
          types: this.getSelection(form.helmets.selection, this.armours),
          minSockets: form.helmets.minSockets,
          minLinks: form.helmets.minLinks,
          minSocketsHighlight: form.helmets.minSocketsHighlight,
          minLinksHighlight: form.helmets.minLinksHighlight,
        },
        boots: {
          types: this.getSelection(form.boots.selection, this.armours),
          minSockets: form.boots.minSockets,
          minLinks: form.boots.minLinks,
          minSocketsHighlight: form.boots.minSocketsHighlight,
          minLinksHighlight: form.boots.minLinksHighlight,
        },
        gloves: {
          types: this.getSelection(form.gloves.selection, this.armours),
          minSockets: form.gloves.minSockets,
          minLinks: form.gloves.minLinks,
          minSocketsHighlight: form.gloves.minSocketsHighlight,
          minLinksHighlight: form.gloves.minLinksHighlight,
        },
        shields: {
          types: this.getSelection(form.shields.selection, this.armours),
          minSockets: form.shields.minSockets,
          minLinks: form.shields.minLinks,
          minSocketsHighlight: form.shields.minSocketsHighlight,
          minLinksHighlight: form.shields.minLinksHighlight,
        },
        flasks: {
          classes: this.getSelection(form.flasks.selection, this.flasks),
        },
        chromatics: this.getSelection(form.chromatics, this.sizes),
        belts: this.getSelection(form.belts, this.belts),
        amulets: this.getSelection(form.amulets, this.amulets),
        rings: this.getSelection(form.rings, this.rings),
      })
      .pipe(
        map((script) => {
          navigator.clipboard.writeText(script);
          return script;
        })
      );
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

  private sortBy<T extends { [key: string]: any }>(
    key: string | ((obj: T) => any)
  ) {
    const getValue = (val: T) =>
      typeof key === 'string' ? val[key] : key(val);
    return (a: T, b: T) =>
      getValue(a) > getValue(b) ? 1 : getValue(b) > getValue(a) ? -1 : 0;
  }
}
