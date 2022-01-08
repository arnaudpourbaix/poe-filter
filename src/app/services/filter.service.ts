import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import {
  GenerateArmourConfig,
  GenerateConfig,
  GenerateFlaskConfig,
  GenerateItemConfig,
  GenerateWeaponConfig,
} from '../models/generate-config';
import { Item } from '../models/item';
import { ItemService } from './item.service';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  constructor(
    private readonly http: HttpClient,
    private readonly itemService: ItemService
  ) {}

  generate(config: GenerateConfig) {
    console.log(config);
    return forkJoin([
      this.itemService.getItems(),
      this.http.get('assets/template.filter', { responseType: 'text' }),
    ]).pipe(
      map(([items, template]) => {
        const script = [] as string[];
        this.generateChromatics(config.chromaticSizes, script);
        this.generateQualityFlaskAndGem(
          config.minQualityFlask,
          config.minQualityGem,
          script
        );
        this.generateFlasks(config.flasks, items, script);
        this.generateWeapons(config.oneHandWeapons, items, script);
        this.generateWeapons(config.twoHandWeapons, items, script);
        this.generateArmours('Body Armours', config.bodyArmours, items, script);
        this.generateArmours('Boots', config.boots, items, script);
        this.generateArmours('Gloves', config.gloves, items, script);
        this.generateArmours('Helmets', config.helmets, items, script);
        this.generateArmours('Shields', config.shields, items, script);
        this.generateBaseTypes(config.belts, script);
        this.generateBaseTypes(config.amulets, script);
        this.generateBaseTypes(config.rings, script);
        this.generateBlock(
          true,
          [`Class "Amulet"`, `BaseType Talisman`],
          script
        );
        this.generateRares(config.rareSizes, script);
        return template.replace('{{INSERT}}', script.join('\r\n'));
      })
    );
  }

  private generateQualityFlaskAndGem(
    flaskQuality: number,
    gemQuality: number,
    script: string[]
  ) {
    const bestQuality = [
      'SetFontSize 45',
      'SetTextColor 255 255 255 255',
      'SetBorderColor 255 255 255 255',
      'SetBackgroundColor 155 138 138 255',
      'PlayEffect Grey Temp',
    ];
    const lesserQuality = [
      'SetFontSize 40',
      'SetTextColor 0 0 0 255',
      'SetBorderColor 200 200 200 255',
      'SetBackgroundColor 130 110 110 255',
    ];
    [...this.itemService.qualities].reverse().forEach((q) => {
      if (q >= flaskQuality) {
        const params = q === 20 ? bestQuality : lesserQuality;
        this.generateBlock(
          true,
          ['Class "Flask"', `Quality >= ${q}`, ...params],
          script
        );
      }
      if (q >= gemQuality) {
        const params = q === 20 ? bestQuality : lesserQuality;
        this.generateBlock(
          true,
          ['Class "Gems"', `Quality >= ${q}`, ...params],
          script
        );
      }
    });
  }

  private generateChromatics(sizes: string[], script: string[]) {
    this.itemService.sizes.forEach((size) => {
      const common = [
        `Width ${size.value.substring(0, 1)}`,
        `Height ${size.value.substring(2, 3)}`,
        'SocketGroup "RGB"',
        'SetFontSize 40',
      ];
      const magic = ['Rarity Rare', 'SetBackgroundColor 75 75 70 120'];
      const rare = [
        'Rarity <= Magic',
        'SetTextColor 0 0 0 255',
        'SetBorderColor 0 0 0 255',
        'SetBackgroundColor 130 110 110 255',
      ];
      const cont = sizes.includes(size.value) ? '' : 'Continue';
      this.generateBlock(true, [...common, ...magic, cont], script);
      this.generateBlock(true, [...common, ...rare, cont], script);
    });
  }

  private generateRares(sizes: string[], script: string[]) {
    this.itemService.sizes.forEach((size) => {
      if (sizes.includes(size.value)) {
        this.generateBlock(
          true,
          [
            'Rarity Rare',
            `Width ${size.value.substring(0, 1)}`,
            `Height ${size.value.substring(2, 3)}`,
          ],
          script
        );
      }
    });
  }

  private generateWeapons(
    config: GenerateWeaponConfig,
    items: Item[],
    script: string[]
  ) {
    if (config.classes.includes('Bows')) {
      this.generateBlock(true, [`Class "Quivers"`], script);
    }
    config.classes.forEach((c) => {
      const weapons = items.filter((i) => i.class === c);
      this.generateItemsByDropLevel(config, weapons, script);
    });
  }

  private generateArmours(
    armourClass: string,
    config: GenerateArmourConfig,
    items: Item[],
    script: string[]
  ) {
    config.types.forEach((armourType) => {
      const armours = this.itemService.filterItemsByArmourTypeAndClass(
        items,
        armourType,
        armourClass
      );
      this.generateItemsByDropLevel(config, armours, script);
    });
  }

  private generateItemsByDropLevel(
    config: GenerateItemConfig,
    items: Item[],
    script: string[]
  ) {
    items.forEach((item, i) => {
      const nextWeapon = items[i + 1] as Item;
      if (item.dropLevel < 60) {
        this.generateBlock(
          false,
          [`BaseType "${item.name}"`, `AreaLevel >= ${nextWeapon.dropLevel}`],
          script
        );
      }
      if (
        config.minSockets !== config.sockets ||
        config.minLinks !== config.links
      ) {
        this.generateBlock(
          true,
          [
            `BaseType "${item.name}"`,
            `Sockets >= ${Math.min(config.sockets, item.maxSockets)}`,
            `LinkedSockets >= ${Math.min(config.links, item.maxSockets)}`,
            'SetBorderColor 200 0 0',
            'SetFontSize 38',
          ],
          script
        );
      }
      this.generateBlock(
        true,
        [
          `BaseType "${item.name}"`,
          config.minSockets > 1
            ? `Sockets >= ${Math.min(config.minSockets, item.maxSockets)}`
            : '',
          config.minLinks
            ? `LinkedSockets >= ${Math.min(config.minLinks, item.maxSockets)}`
            : '',
        ],
        script
      );
    });
  }

  private generateFlasks(
    config: GenerateFlaskConfig,
    items: Item[],
    script: string[]
  ) {
    config.classes.forEach((c) => {
      if (c === 'Utility Flasks') {
        this.generateUtilityFlasks(items, script);
      } else {
        this.generateLifeManaFlasks(c, items, script);
      }
    });
  }

  private generateUtilityFlasks(items: Item[], script: string[]) {
    this.generateBlock(
      true,
      [
        'Quality 0',
        'Class "Utility Flasks"',
        'SetFontSize 45',
        'SetBorderColor 50 200 125',
        'SetBackgroundColor 25 100 75',
        'PlayEffect Grey Temp',
        'MinimapIcon 2 Grey Raindrop',
      ],
      script
    );
  }

  private generateLifeManaFlasks(c: string, items: Item[], script: string[]) {
    const flasks = items.filter((i) => i.class === c);
    flasks.forEach((f, i) => {
      const nextFlask = flasks[i + 1] as Item;
      this.generateBlock(
        true,
        [
          'Quality 0',
          `Class "${c}"`,
          `BaseType "${f.name}`,
          f.dropLevel < 60 ? `AreaLevel < ${nextFlask.dropLevel}` : '',
        ],
        script
      );
    });
  }

  private generateBaseTypes(classes: string[], script: string[]) {
    const c = classes.map((cl) => `"${cl}"`).join(' ');
    this.generateBlock(true, [`BaseType ${c}`], script);
  }

  private generateBlock(show: boolean, lines: string[], script: string[]) {
    script.push(show ? 'Show' : 'Hide');
    lines.filter((l) => !!l).forEach((l) => script.push(`\t${l}`));
  }
}
