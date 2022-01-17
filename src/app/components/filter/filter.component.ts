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
  belts: SectionForm;
  rings: SectionForm;
  amulets: SectionForm;
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
  noSocketConfig: SectionConfig = {
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
      normal: true,
      magic: true,
      rare: true,
    }),
    twoHandWeapons: this.fb.group({
      selection: new FormArray(
        this.twoHandWeapons.map(() => new FormControl(false))
      ),
      minSockets: [1],
      minLinks: [0],
      sockets: [1],
      links: [0],
      normal: true,
      magic: true,
      rare: true,
    }),
    bodyArmours: this.fb.group({
      selection: new FormArray(
        this.armourTypes.map(() => new FormControl(false))
      ),
      minSockets: [3],
      minLinks: [0],
      sockets: [6],
      links: [6],
      normal: true,
      magic: true,
      rare: true,
    }),
    helmets: this.fb.group({
      selection: new FormArray(
        this.armourTypes.map(() => new FormControl(false))
      ),
      minSockets: [1],
      minLinks: [0],
      sockets: [1],
      links: [0],
      normal: true,
      magic: true,
      rare: true,
    }),
    gloves: this.fb.group({
      selection: new FormArray(
        this.armourTypes.map(() => new FormControl(false))
      ),
      minSockets: [1],
      minLinks: [0],
      sockets: [1],
      links: [0],
      normal: true,
      magic: true,
      rare: true,
    }),
    boots: this.fb.group({
      selection: new FormArray(
        this.armourTypes.map(() => new FormControl(false))
      ),
      minSockets: [1],
      minLinks: [0],
      sockets: [1],
      links: [0],
      normal: true,
      magic: true,
      rare: true,
    }),
    shields: this.fb.group({
      selection: new FormArray(
        this.armourTypes.map(() => new FormControl(false))
      ),
      minSockets: [1],
      minLinks: [0],
      sockets: [1],
      links: [0],
      normal: true,
      magic: true,
      rare: true,
    }),
    flasks: this.fb.group({
      selection: new FormArray(this.flasks.map(() => new FormControl(false))),
      minSockets: [0],
      minLinks: [0],
      sockets: [1],
      links: [0],
      normal: true,
      magic: true,
      rare: true,
    }),
    amulets: this.fb.group({
      selection: new FormArray(this.amulets.map(() => new FormControl(false))),
      minSockets: [1],
      minLinks: [0],
      sockets: [1],
      links: [0],
      normal: true,
      magic: true,
      rare: true,
    }),
    rings: this.fb.group({
      selection: new FormArray(this.rings.map(() => new FormControl(false))),
      minSockets: [1],
      minLinks: [0],
      sockets: [1],
      links: [0],
      normal: true,
      magic: true,
      rare: true,
    }),
    belts: this.fb.group({
      selection: new FormArray(this.belts.map(() => new FormControl(false))),
      minSockets: [1],
      minLinks: [0],
      sockets: [1],
      links: [0],
      normal: true,
      magic: true,
      rare: true,
    }),
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
          normal: params['ae'] === 'true',
          magic: params['af'] === 'true',
          rare: params['ag'] === 'true',
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
          normal: params['be'] === 'true',
          magic: params['bf'] === 'true',
          rare: params['bg'] === 'true',
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
          normal: params['ce'] === 'true',
          magic: params['cf'] === 'true',
          rare: params['cg'] === 'true',
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
          normal: params['de'] === 'true',
          magic: params['df'] === 'true',
          rare: params['dg'] === 'true',
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
          normal: params['ee'] === 'true',
          magic: params['ef'] === 'true',
          rare: params['eg'] === 'true',
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
          normal: params['fe'] === 'true',
          magic: params['ff'] === 'true',
          rare: params['fg'] === 'true',
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
          normal: params['ge'] === 'true',
          magic: params['gf'] === 'true',
          rare: params['gg'] === 'true',
        },
        flasks: {
          selection: this.queryParamsToForm(
            params['h'],
            this.form.controls.flasks.value.selection.length
          ),
          normal: params['he'] === 'true',
          magic: params['hf'] === 'true',
          rare: params['hg'] === 'true',
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
        belts: {
          selection: this.queryParamsToForm(
            params['k'],
            this.form.controls.belts.value.selection.length
          ),
          normal: params['ke'] === 'true',
          magic: params['kf'] === 'true',
          rare: params['kg'] === 'true',
        } as SectionForm,
        amulets: {
          selection: this.queryParamsToForm(
            params['l'],
            this.form.controls.amulets.value.selection.length
          ),
          normal: params['le'] === 'true',
          magic: params['lf'] === 'true',
          rare: params['lg'] === 'true',
        } as SectionForm,
        rings: {
          selection: this.queryParamsToForm(
            params['m'],
            this.form.controls.rings.value.selection.length
          ),
          normal: params['me'] === 'true',
          magic: params['mf'] === 'true',
          rare: params['mg'] === 'true',
        } as SectionForm,
      };
    },
    queryParamsMapper: (form) => {
      return {
        a: this.formToQueryParams(form.oneHandWeapons?.selection ?? []),
        aa: form.oneHandWeapons?.minSockets,
        ab: form.oneHandWeapons?.minLinks,
        ac: form.oneHandWeapons?.sockets,
        ad: form.oneHandWeapons?.links,
        ae: form.oneHandWeapons?.normal,
        af: form.oneHandWeapons?.magic,
        ag: form.oneHandWeapons?.rare,
        b: this.formToQueryParams(form.twoHandWeapons?.selection ?? []),
        ba: form.twoHandWeapons?.minSockets,
        bb: form.twoHandWeapons?.minLinks,
        bc: form.twoHandWeapons?.sockets,
        bd: form.twoHandWeapons?.links,
        be: form.twoHandWeapons?.normal,
        bf: form.twoHandWeapons?.magic,
        bg: form.twoHandWeapons?.rare,
        c: this.formToQueryParams(form.bodyArmours?.selection ?? []),
        ca: form.bodyArmours?.minSockets,
        cb: form.bodyArmours?.minLinks,
        cc: form.bodyArmours?.sockets,
        cd: form.bodyArmours?.links,
        ce: form.bodyArmours?.normal,
        cf: form.bodyArmours?.magic,
        cg: form.bodyArmours?.rare,
        d: this.formToQueryParams(form.helmets?.selection ?? []),
        da: form.helmets?.minSockets,
        db: form.helmets?.minLinks,
        dc: form.helmets?.sockets,
        dd: form.helmets?.links,
        de: form.helmets?.normal,
        df: form.helmets?.magic,
        dg: form.helmets?.rare,
        e: this.formToQueryParams(form.boots?.selection ?? []),
        ea: form.boots?.minSockets,
        eb: form.boots?.minLinks,
        ec: form.boots?.sockets,
        ed: form.boots?.links,
        ee: form.boots?.normal,
        ef: form.boots?.magic,
        eg: form.boots?.rare,
        f: this.formToQueryParams(form.gloves?.selection ?? []),
        fa: form.gloves?.minSockets,
        fb: form.gloves?.minLinks,
        fc: form.gloves?.sockets,
        fd: form.gloves?.links,
        fe: form.gloves?.normal,
        ff: form.gloves?.magic,
        fg: form.gloves?.rare,
        g: this.formToQueryParams(form.shields?.selection ?? []),
        ga: form.shields?.minSockets,
        gb: form.shields?.minLinks,
        gc: form.shields?.sockets,
        gd: form.shields?.links,
        ge: form.shields?.normal,
        gf: form.shields?.magic,
        gg: form.shields?.rare,
        h: this.formToQueryParams(form.flasks?.selection ?? []),
        he: form.flasks?.normal,
        hf: form.flasks?.magic,
        hg: form.flasks?.rare,
        ia: this.formToQueryParams(form.chromaticSizes ?? []),
        ib: this.formToQueryParams(form.rareSizes ?? []),
        ic: form.qFlasks,
        id: form.qGems,
        k: this.formToQueryParams(form.belts?.selection ?? []),
        ke: form.belts?.normal,
        kf: form.belts?.magic,
        kg: form.belts?.rare,
        l: this.formToQueryParams(form.amulets?.selection ?? []),
        le: form.amulets?.normal,
        lf: form.amulets?.magic,
        lg: form.amulets?.rare,
        m: this.formToQueryParams(form.rings?.selection ?? []),
        me: form.rings?.normal,
        mf: form.rings?.magic,
        mg: form.rings?.rare,
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
  get beltsForm() {
    return this.form.controls.belts as TypedFormGroup<SectionForm>;
  }
  get ringsForm() {
    return this.form.controls.rings as TypedFormGroup<SectionForm>;
  }
  get amuletsForm() {
    return this.form.controls.amulets as TypedFormGroup<SectionForm>;
  }

  generate() {
    const form = this.form.value;
    this.script$ = this.filterService
      .generate({
        oneHandWeapons: {
          names: this.getSelection(
            form.oneHandWeapons.selection,
            this.oneHandWeapons
          ),
          ...form.oneHandWeapons,
        },
        twoHandWeapons: {
          names: this.getSelection(
            form.twoHandWeapons.selection,
            this.twoHandWeapons
          ),
          ...form.twoHandWeapons,
        },
        bodyArmours: {
          names: this.getSelection(
            form.bodyArmours.selection,
            this.armourTypes
          ),
          ...form.bodyArmours,
        },
        helmets: {
          names: this.getSelection(form.helmets.selection, this.armourTypes),
          ...form.helmets,
        },
        boots: {
          names: this.getSelection(form.boots.selection, this.armourTypes),
          ...form.boots,
        },
        gloves: {
          names: this.getSelection(form.gloves.selection, this.armourTypes),
          ...form.gloves,
        },
        shields: {
          names: this.getSelection(form.shields.selection, this.armourTypes),
          ...form.shields,
        },
        flasks: {
          names: this.getSelection(form.flasks.selection, this.flasks),
          ...form.flasks,
        },
        chromaticSizes: this.getSelection(
          form.chromaticSizes,
          this.chromaticSizes
        ),
        rareSizes: this.getSelection(form.rareSizes, this.rareSizes),
        minQualityFlask: form.qFlasks,
        minQualityGem: form.qGems,
        belts: {
          names: this.getSelection(form.belts.selection, this.belts),
          ...form.belts,
        },
        amulets: {
          names: this.getSelection(form.amulets.selection, this.amulets),
          ...form.amulets,
        },
        rings: {
          names: this.getSelection(form.rings.selection, this.rings),
          ...form.rings,
        },
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
