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
  qFlasks: number;
  qGems: number;
  rareSizes: boolean[];
  chromaticSizes: boolean[];
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  armourTypes = this.itemService.armourTypes;
  oneHandWeapons = this.itemService.oneHandWeapons.map(
    (a) => ({ value: a, label: a } as ItemView)
  );
  twoHandWeapons = this.itemService.twoHandWeapons.map(
    (a) => ({ value: a, label: a } as ItemView)
  );
  flasks = this.itemService.flasks.map(
    (a) => ({ value: a, label: a } as ItemView)
  );

  chromaticSizes = [...this.itemService.sizes].filter((i) => i.chromatic);
  rareSizes = this.itemService.sizes;

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
      sockets: [1],
      links: [0],
    }),
    twoHandWeapons: this.fb.group({
      selection: new FormArray(
        this.twoHandWeapons.map(() => new FormControl(false))
      ),
      minSockets: [1],
      minLinks: [0],
      sockets: [1],
      links: [0],
    }),
    bodyArmours: this.fb.group({
      selection: new FormArray(
        this.armourTypes.map(() => new FormControl(false))
      ),
      minSockets: [3],
      minLinks: [0],
      sockets: [6],
      links: [6],
    }),
    helmets: this.fb.group({
      selection: new FormArray(
        this.armourTypes.map(() => new FormControl(false))
      ),
      minSockets: [1],
      minLinks: [0],
      sockets: [1],
      links: [0],
    }),
    gloves: this.fb.group({
      selection: new FormArray(
        this.armourTypes.map(() => new FormControl(false))
      ),
      minSockets: [1],
      minLinks: [0],
      sockets: [1],
      links: [0],
    }),
    boots: this.fb.group({
      selection: new FormArray(
        this.armourTypes.map(() => new FormControl(false))
      ),
      minSockets: [1],
      minLinks: [0],
      sockets: [1],
      links: [0],
    }),
    shields: this.fb.group({
      selection: new FormArray(
        this.armourTypes.map(() => new FormControl(false))
      ),
      minSockets: [1],
      minLinks: [0],
      sockets: [1],
      links: [0],
    }),
    flasks: this.fb.group({
      selection: new FormArray(this.flasks.map(() => new FormControl(false))),
      minSockets: [0],
      minLinks: [0],
      sockets: [1],
      links: [0],
    }),
    amulets: new FormArray(this.amulets.map(() => new FormControl(true))),
    rings: new FormArray(this.rings.map(() => new FormControl(true))),
    belts: new FormArray(this.belts.map(() => new FormControl(true))),
    rareSizes: new FormArray(this.rareSizes.map(() => new FormControl(true))),
    chromaticSizes: new FormArray(
      this.chromaticSizes.map(() => new FormControl(true))
    ),
    qFlasks: [5],
    qGems: [5],
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
          sockets: +params['ac'],
          links: +params['ad'],
        },
        twoHandWeapons: {
          selection: this.queryParamsToForm(
            params['b'],
            this.form.controls.twoHandWeapons.value.selection.length
          ),
          minSockets: +params['ba'],
          minLinks: +params['bb'],
          sockets: +params['bc'],
          links: +params['bd'],
        },
        bodyArmours: {
          selection: this.queryParamsToForm(
            params['c'],
            this.form.controls.bodyArmours.value.selection.length
          ),
          minSockets: +params['ca'],
          minLinks: +params['cb'],
          sockets: +params['cc'],
          links: +params['cd'],
        },
        helmets: {
          selection: this.queryParamsToForm(
            params['d'],
            this.form.controls.helmets.value.selection.length
          ),
          minSockets: +params['da'],
          minLinks: +params['db'],
          sockets: +params['dc'],
          links: +params['dd'],
        },
        boots: {
          selection: this.queryParamsToForm(
            params['e'],
            this.form.controls.gloves.value.selection.length
          ),
          minSockets: +params['ea'],
          minLinks: +params['eb'],
          sockets: +params['ec'],
          links: +params['ed'],
        },
        gloves: {
          selection: this.queryParamsToForm(
            params['f'],
            this.form.controls.boots.value.selection.length
          ),
          minSockets: +params['fa'],
          minLinks: +params['fb'],
          sockets: +params['fc'],
          links: +params['fd'],
        },
        shields: {
          selection: this.queryParamsToForm(
            params['g'],
            this.form.controls.helmets.value.selection.length
          ),
          minSockets: +params['ga'],
          minLinks: +params['gb'],
          sockets: +params['gc'],
          links: +params['gd'],
        },
        flasks: {
          selection: this.queryParamsToForm(
            params['h'],
            this.form.controls.flasks.value.selection.length
          ),
        } as SectionForm,
        chromaticSizes: this.queryParamsToForm(
          params['ia'],
          this.form.controls.chromaticSizes.value.length
        ),
        rareSizes: this.queryParamsToForm(
          params['ib'],
          this.form.controls.rareSizes.value.length
        ),
        qFlasks: +params['ic'],
        qGems: +params['id'],
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
        ac: form.oneHandWeapons?.sockets,
        ad: form.oneHandWeapons?.links,
        b: this.formToQueryParams(form.twoHandWeapons?.selection ?? []),
        ba: form.twoHandWeapons?.minSockets,
        bb: form.twoHandWeapons?.minLinks,
        bc: form.twoHandWeapons?.sockets,
        bd: form.twoHandWeapons?.links,
        c: this.formToQueryParams(form.bodyArmours?.selection ?? []),
        ca: form.bodyArmours?.minSockets,
        cb: form.bodyArmours?.minLinks,
        cc: form.bodyArmours?.sockets,
        cd: form.bodyArmours?.links,
        d: this.formToQueryParams(form.helmets?.selection ?? []),
        da: form.helmets?.minSockets,
        db: form.helmets?.minLinks,
        dc: form.helmets?.sockets,
        dd: form.helmets?.links,
        e: this.formToQueryParams(form.boots?.selection ?? []),
        ea: form.boots?.minSockets,
        eb: form.boots?.minLinks,
        ec: form.boots?.sockets,
        ed: form.boots?.links,
        f: this.formToQueryParams(form.gloves?.selection ?? []),
        fa: form.gloves?.minSockets,
        fb: form.gloves?.minLinks,
        fc: form.gloves?.sockets,
        fd: form.gloves?.links,
        g: this.formToQueryParams(form.shields?.selection ?? []),
        ga: form.shields?.minSockets,
        gb: form.shields?.minLinks,
        gc: form.shields?.sockets,
        gd: form.shields?.links,
        h: this.formToQueryParams(form.flasks?.selection ?? []),
        ia: this.formToQueryParams(form.chromaticSizes ?? []),
        ib: this.formToQueryParams(form.rareSizes ?? []),
        ic: form.qFlasks,
        id: form.qGems,
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
        oneHandWeapons: {
          classes: this.getSelection(
            form.oneHandWeapons.selection,
            this.oneHandWeapons
          ),
          minSockets: form.oneHandWeapons.minSockets,
          minLinks: form.oneHandWeapons.minLinks,
          sockets: form.oneHandWeapons.sockets,
          links: form.oneHandWeapons.links,
        },
        twoHandWeapons: {
          classes: this.getSelection(
            form.twoHandWeapons.selection,
            this.twoHandWeapons
          ),
          minSockets: form.twoHandWeapons.minSockets,
          minLinks: form.twoHandWeapons.minLinks,
          sockets: form.twoHandWeapons.sockets,
          links: form.twoHandWeapons.links,
        },
        bodyArmours: {
          types: this.getSelection(
            form.bodyArmours.selection,
            this.armourTypes
          ),
          minSockets: form.bodyArmours.minSockets,
          minLinks: form.bodyArmours.minLinks,
          sockets: form.bodyArmours.sockets,
          links: form.bodyArmours.links,
        },
        helmets: {
          types: this.getSelection(form.helmets.selection, this.armourTypes),
          minSockets: form.helmets.minSockets,
          minLinks: form.helmets.minLinks,
          sockets: form.helmets.sockets,
          links: form.helmets.links,
        },
        boots: {
          types: this.getSelection(form.boots.selection, this.armourTypes),
          minSockets: form.boots.minSockets,
          minLinks: form.boots.minLinks,
          sockets: form.boots.sockets,
          links: form.boots.links,
        },
        gloves: {
          types: this.getSelection(form.gloves.selection, this.armourTypes),
          minSockets: form.gloves.minSockets,
          minLinks: form.gloves.minLinks,
          sockets: form.gloves.sockets,
          links: form.gloves.links,
        },
        shields: {
          types: this.getSelection(form.shields.selection, this.armourTypes),
          minSockets: form.shields.minSockets,
          minLinks: form.shields.minLinks,
          sockets: form.shields.sockets,
          links: form.shields.links,
        },
        flasks: {
          classes: this.getSelection(form.flasks.selection, this.flasks),
        },
        chromaticSizes: this.getSelection(
          form.chromaticSizes,
          this.chromaticSizes
        ),
        rareSizes: this.getSelection(form.rareSizes, this.rareSizes),
        minQualityFlask: form.qFlasks,
        minQualityGem: form.qGems,
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
}
