import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import {
  GenerateConfig,
  GenerateItemConfig,
  GenerateSocketItemConfig,
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
    config: GenerateSocketItemConfig,
    items: Item[],
    script: string[]
  ) {
    if (config.list.includes('Bows')) {
      this.generateBlock(true, [`Class "Quivers"`], script);
    }
    config.list.forEach((c) => {
      const weapons = items.filter((i) => i.class === c);
      this.generateItemsByDropLevel(config, weapons, script, true);
    });
    config.secondaryList.forEach((c) => {
      const weapons = items.filter((i) => i.class === c);
      this.generateItemsByDropLevel(config, weapons, script, false);
    });
  }

  private generateArmours(
    armourClass: string,
    config: GenerateSocketItemConfig,
    items: Item[],
    script: string[]
  ) {
    config.list.forEach((armourType) => {
      const armours = this.itemService.filterItemsByArmourTypeAndClass(
        items,
        armourType,
        armourClass
      );
      this.generateItemsByDropLevel(config, armours, script, true);
    });
    config.secondaryList.forEach((armourType) => {
      const armours = this.itemService.filterItemsByArmourTypeAndClass(
        items,
        armourType,
        armourClass
      );
      this.generateItemsByDropLevel(config, armours, script, false);
    });
  }

  private generateItemsByDropLevel(
    config: GenerateSocketItemConfig,
    items: Item[],
    script: string[],
    primaryChoice: boolean
  ) {
    items
      .filter((i) => i.dropLevel < 60)
      .forEach((item, i) => {
        const itemPlus1 = items[i + 1] as Item;
        const itemPlus2 = (items[i + 2] as Item) ?? itemPlus1;
        if (
          config.minSockets !== config.maxSockets ||
          config.minLinks !== config.maxSockets
        ) {
          this.generateBlock(
            true,
            [
              `BaseType "${item.name}"`,
              `ItemLevel < ${itemPlus1.dropLevel}`,
              this.getRarity(config),
              `Sockets >= ${Math.min(config.maxSockets, item.maxSockets)}`,
              `LinkedSockets >= ${Math.min(
                config.maxSockets,
                item.maxSockets
              )}`,
              'SetBorderColor 200 0 0',
              `SetFontSize ${primaryChoice ? 40 : 32}`,
            ],
            script
          );
          this.generateBlock(
            true,
            [
              `BaseType "${item.name}"`,
              `ItemLevel < ${itemPlus2.dropLevel}`,
              this.getRarity(config),
              `Sockets >= ${Math.min(config.maxSockets, item.maxSockets)}`,
              `LinkedSockets >= ${Math.min(
                config.maxSockets,
                item.maxSockets
              )}`,
              'SetBorderColor 200 0 0',
              `SetFontSize ${primaryChoice ? 26 : 18}`,
            ],
            script
          );
        }
        this.generateBlock(
          true,
          [
            `BaseType "${item.name}"`,
            `ItemLevel < ${itemPlus1.dropLevel}`,
            this.getRarity(config),
            config.minSockets > 1
              ? `Sockets >= ${Math.min(config.minSockets, item.maxSockets)}`
              : '',
            config.minLinks
              ? `LinkedSockets >= ${Math.min(config.minLinks, item.maxSockets)}`
              : '',
            `SetFontSize ${primaryChoice ? 40 : 32}`,
          ],
          script
        );
        this.generateBlock(
          true,
          [
            `BaseType "${item.name}"`,
            `ItemLevel < ${itemPlus2.dropLevel}`,
            this.getRarity(config),
            config.minSockets > 1
              ? `Sockets >= ${Math.min(config.minSockets, item.maxSockets)}`
              : '',
            config.minLinks
              ? `LinkedSockets >= ${Math.min(config.minLinks, item.maxSockets)}`
              : '',
            `SetFontSize ${primaryChoice ? 26 : 18}`,
          ],
          script
        );
      });
  }

  private generateFlasks(
    config: GenerateItemConfig,
    items: Item[],
    script: string[]
  ) {
    config.list.forEach((c) => {
      if (c === 'Utility Flasks') {
        this.generateUtilityFlasks(config, script);
      } else {
        this.generateLifeManaFlasks(config, c, items, script);
      }
    });
  }

  private generateUtilityFlasks(config: GenerateItemConfig, script: string[]) {
    this.generateBlock(
      true,
      [
        'Quality 0',
        'Class "Utility Flasks"',
        this.getRarity(config),
        'SetFontSize 45',
        'SetBorderColor 50 200 125',
        'SetBackgroundColor 25 100 75',
        'PlayEffect Grey Temp',
        'MinimapIcon 2 Grey Raindrop',
      ],
      script
    );
  }

  private generateLifeManaFlasks(
    config: GenerateItemConfig,
    c: string,
    items: Item[],
    script: string[]
  ) {
    const flasks = items.filter((i) => i.class === c);
    flasks.forEach((f, i) => {
      const nextFlask = flasks[i + 1] as Item;
      this.generateBlock(
        true,
        [
          'Quality 0',
          `Class "${c}"`,
          `BaseType "${f.name}`,
          this.getRarity(config),
          f.dropLevel < 60 ? `ItemLevel < ${nextFlask.dropLevel}` : '',
        ],
        script
      );
    });
  }

  private generateBaseTypes(config: GenerateItemConfig, script: string[]) {
    const c = config.list.map((cl) => `"${cl}"`).join(' ');
    const rarity = `${config.normal ? 'Normal' : ''} ${
      config.magic ? 'Magic' : ''
    } ${config.rare ? 'Rare' : ''}`;
    this.generateBlock(true, [`BaseType ${c}`, this.getRarity(config)], script);
  }

  private generateBlock(show: boolean, lines: string[], script: string[]) {
    script.push(show ? 'Show' : 'Hide');
    lines.filter((l) => !!l).forEach((l) => script.push(`\t${l}`));
  }

  private getRarity(config: GenerateItemConfig) {
    const rarity = `${config.normal ? 'Normal' : ''} ${
      config.magic ? 'Magic' : ''
    } ${config.rare ? 'Rare' : ''}`;
    return `Rarity ${rarity}`;
  }
}
