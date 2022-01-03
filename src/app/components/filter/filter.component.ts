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
    magicSizes: false,
  };
  twoHandWeaponsConfig: SectionConfig = {
    sockets: 6,
    magicSizes: false,
  };
  bodyArmoursConfig: SectionConfig = {
    sockets: 6,
    magicSizes: false,
  };
  helmetsConfig: SectionConfig = {
    sockets: 4,
    magicSizes: false,
  };
  glovesConfig: SectionConfig = {
    sockets: 4,
    magicSizes: false,
  };
  bootsConfig: SectionConfig = {
    sockets: 4,
    magicSizes: false,
  };
  shieldsConfig: SectionConfig = {
    sockets: 3,
    magicSizes: false,
  };
  flaskConfig: SectionConfig = {
    sockets: 0,
    magicSizes: false,
  };

  script$ = of('');

  form = this.fb.group({
    oneHandWeapons: this.fb.group({
      selection: new FormArray(
        this.oneHandWeapons.map(() => new FormControl(false))
      ),
      minSockets: [1],
      minLinks: [0],
      showMagic: [true],
      magicSize: [''],
    }),
    twoHandWeapons: this.fb.group({
      selection: new FormArray(
        this.twoHandWeapons.map(() => new FormControl(false))
      ),
      minSockets: [1],
      minLinks: [0],
      showMagic: [true],
      magicSize: [''],
    }),
    bodyArmours: this.fb.group({
      selection: new FormArray(this.armours.map(() => new FormControl(false))),
      minSockets: [3],
      minLinks: [3],
      showMagic: [true],
      magicSize: [''],
    }),
    helmets: this.fb.group({
      selection: new FormArray(this.armours.map(() => new FormControl(false))),
      minSockets: [1],
      minLinks: [0],
      showMagic: [true],
      magicSize: [''],
    }),
    gloves: this.fb.group({
      selection: new FormArray(this.armours.map(() => new FormControl(false))),
      minSockets: [1],
      minLinks: [0],
      showMagic: [true],
      magicSize: [''],
    }),
    boots: this.fb.group({
      selection: new FormArray(this.armours.map(() => new FormControl(false))),
      minSockets: [1],
      minLinks: [0],
      showMagic: [true],
      magicSize: [''],
    }),
    shields: this.fb.group({
      selection: new FormArray(this.armours.map(() => new FormControl(false))),
      minSockets: [1],
      minLinks: [0],
      showMagic: [true],
      magicSize: [''],
    }),
    flasks: this.fb.group({
      selection: new FormArray(this.flasks.map(() => new FormControl(true))),
      minSockets: [0],
      minLinks: [0],
      showMagic: [true],
      magicSize: [''],
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
          minSockets: +params['b'],
          minLinks: +params['c'],
        },
        twoHandWeapons: {
          selection: this.queryParamsToForm(
            params['d'],
            this.form.controls.twoHandWeapons.value.selection.length
          ),
          minSockets: +params['e'],
          minLinks: +params['f'],
        },
        bodyArmours: {
          selection: this.queryParamsToForm(
            params['g'],
            this.form.controls.bodyArmours.value.selection.length
          ),
          minSockets: +params['h'],
          minLinks: +params['i'],
        },
        helmets: {
          selection: this.queryParamsToForm(
            params['j'],
            this.form.controls.helmets.value.selection.length
          ),
          minSockets: +params['k'],
          minLinks: +params['l'],
        },
        gloves: {
          selection: this.queryParamsToForm(
            params['m'],
            this.form.controls.gloves.value.selection.length
          ),
          minSockets: +params['n'],
          minLinks: +params['o'],
        },
        boots: {
          selection: this.queryParamsToForm(
            params['p'],
            this.form.controls.boots.value.selection.length
          ),
          minSockets: +params['q'],
          minLinks: +params['r'],
        },
        shields: {
          selection: this.queryParamsToForm(
            params['s'],
            this.form.controls.helmets.value.selection.length
          ),
          minSockets: +params['t'],
          minLinks: +params['u'],
        },
        flasks: {
          selection: this.queryParamsToForm(
            params['v'],
            this.form.controls.flasks.value.selection.length
          ),
        } as SectionForm,
        chromatics: this.queryParamsToForm(
          params['w'],
          this.form.controls.chromatics.value.length
        ),
        minQualityRecipe: +params['x'],
        belts: this.queryParamsToForm(
          params['y'],
          this.form.controls.belts.value.length
        ),
        amulets: this.queryParamsToForm(
          params['z'],
          this.form.controls.amulets.value.length
        ),
        rings: this.queryParamsToForm(
          params['aa'],
          this.form.controls.rings.value.length
        ),
      };
    },
    queryParamsMapper: (form) => {
      return {
        a: this.formToQueryParams(form.oneHandWeapons?.selection ?? []),
        b: form.oneHandWeapons?.minSockets,
        c: form.oneHandWeapons?.minLinks,
        d: this.formToQueryParams(form.twoHandWeapons?.selection ?? []),
        e: form.twoHandWeapons?.minSockets,
        f: form.twoHandWeapons?.minLinks,
        g: this.formToQueryParams(form.bodyArmours?.selection ?? []),
        h: form.bodyArmours?.minSockets,
        i: form.bodyArmours?.minLinks,
        j: this.formToQueryParams(form.helmets?.selection ?? []),
        k: form.helmets?.minSockets,
        l: form.helmets?.minLinks,
        m: this.formToQueryParams(form.boots?.selection ?? []),
        n: form.boots?.minSockets,
        o: form.boots?.minLinks,
        p: this.formToQueryParams(form.gloves?.selection ?? []),
        q: form.gloves?.minSockets,
        r: form.gloves?.minLinks,
        s: this.formToQueryParams(form.shields?.selection ?? []),
        t: form.shields?.minSockets,
        u: form.shields?.minLinks,
        v: this.formToQueryParams(form.flasks?.selection ?? []),
        w: this.formToQueryParams(form.chromatics ?? []),
        x: form.minQualityRecipe,
        y: this.formToQueryParams(form.belts ?? []),
        z: this.formToQueryParams(form.amulets ?? []),
        aa: this.formToQueryParams(form.rings ?? []),
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
        },
        twoHandWeapons: {
          classes: this.getSelection(
            form.twoHandWeapons.selection,
            this.twoHandWeapons
          ),
          minSockets: form.twoHandWeapons.minSockets,
          minLinks: form.twoHandWeapons.minLinks,
        },
        bodyArmours: {
          types: this.getSelection(form.bodyArmours.selection, this.armours),
          minSockets: form.bodyArmours.minSockets,
          minLinks: form.bodyArmours.minLinks,
        },
        helmets: {
          types: this.getSelection(form.helmets.selection, this.armours),
          minSockets: form.helmets.minSockets,
          minLinks: form.helmets.minLinks,
        },
        boots: {
          types: this.getSelection(form.boots.selection, this.armours),
          minSockets: form.boots.minSockets,
          minLinks: form.boots.minLinks,
        },
        gloves: {
          types: this.getSelection(form.gloves.selection, this.armours),
          minSockets: form.gloves.minSockets,
          minLinks: form.gloves.minLinks,
        },
        shields: {
          types: this.getSelection(form.shields.selection, this.armours),
          minSockets: form.shields.minSockets,
          minLinks: form.shields.minLinks,
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
