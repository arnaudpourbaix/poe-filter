import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { Item } from '../models/item';
import * as he from 'he';
import { Size } from '../models/size';
import { ItemSocket } from '../models/socket';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  readonly sockets: ItemSocket[] = [
    { number: 1, minLevel: 1 },
    { number: 2, minLevel: 1 },
    { number: 3, minLevel: 2 },
    { number: 4, minLevel: 25 },
    { number: 5, minLevel: 35 },
    { number: 6, minLevel: 50 },
  ];

  readonly links: number[] = [0, 2, 3, 4, 5, 6];

  readonly qualities = [5, 10, 15, 20];

  readonly sizes: Size[] = [
    { label: '1x1', value: '1x1', chromatic: false },
    { label: '2x1', value: '2x1', chromatic: false },
    { label: '1x3', value: '1x3', chromatic: true },
    { label: '1x4', value: '1x4', chromatic: true },
    { label: '2x2', value: '2x2', chromatic: true },
    { label: '2x3', value: '2x3', chromatic: true },
    { label: '2x4', value: '2x4', chromatic: true },
  ];

  readonly armourTypes = [
    { label: 'Armour', value: 'str' },
    { label: 'Armour/Evasion', value: 'strDex' },
    { label: 'Armour/ES', value: 'strInt' },
    { label: 'Energy Shield', value: 'int' },
    { label: 'Evasion', value: 'dex' },
    { label: 'Evasion/ES', value: 'dexInt' },
  ];

  readonly armourClasses = [
    'Body Armours',
    'Boots',
    'Gloves',
    'Helmets',
    'Shields',
  ];

  readonly oneHandWeapons = [
    'Claws',
    'Daggers',
    'One Hand Axes',
    'One Hand Maces',
    'One Hand Swords',
    'Rune Daggers',
    'Sceptres',
    'Wands',
  ];

  readonly twoHandWeapons = [
    'Bows',
    'Staves',
    'Two Hand Axes',
    'Two Hand Maces',
    'Two Hand Swords',
    'Warstaves',
  ];

  readonly flasks = [
    'Life Flasks',
    'Mana Flasks',
    'Utility Flasks',
    'Hybrid Flasks',
  ];

  readonly belts = [
    'Chain Belt',
    'Cloth Belt',
    'Crystal Belt',
    'Heavy Belt',
    'Leather Belt',
    'Rustic Sash',
    'Studded Belt',
    'Vanguard Belt',
  ];

  readonly amulets = [
    'Agate Amulet',
    'Amber Amulet',
    'Blue Pearl Amulet',
    'Citrine Amulet',
    'Coral Amulet',
    'Gold Amulet',
    'Jade Amulet',
    'Lapis Amulet',
    'Marble Amulet',
    'Onyx Amulet',
    'Paua Amulet',
    'Seaglass Amulet',
    'Turquoise Amulet',
  ];

  readonly rings = [
    'Amethyst Ring',
    'Cerulean Ring',
    'Coral Ring',
    'Diamond Ring',
    'Gold Ring',
    'Iolite Ring',
    'Iron Ring',
    'Moonstone Ring',
    'Opal Ring',
    'Paua Ring',
    'Prismatic Ring',
    'Ruby Ring',
    'Sapphire Ring',
    'Steel Ring',
    'Topaz Ring',
    'Two-Stone Ring',
    'Unset Ring',
    'Vermillion Ring',
  ];

  constructor(private readonly http: HttpClient) {}

  getItems() {
    return this.http.get<{ [key: string]: any }[]>('assets/items.json').pipe(
      map((items) =>
        items
          .map((item) => {
            const i = item['title'];
            const dropLevel = +i['drop level'];
            let maxSockets = this.getMaxSockets(dropLevel, i['class']);
            const result: Item = {
              name: i['name'],
              class: i['class'],
              dropLevel,
              requiredLevel: +i['required level'],
              width: +i['size x'],
              height: +i['size y'],
              requiredStrength: +i['required strength'],
              requiredDexterity: +i['required dexterity'],
              requiredIntelligence: +i['required intelligence'],
              html: he.decode(i['html']),
              maxSockets,
              isDropRestricted: i['is drop restricted'] === '1',
              isDropEnabled: i['drop enabled'] === '1',
            };
            return result;
          })
          .filter((i) => !i.isDropRestricted && i.isDropEnabled)
          .sort((a, b) => a.requiredLevel - b.requiredLevel)
      )
    );
  }

  getMaxSockets(dropLevel: number, itemClass: string) {
    const sockets = [...this.sockets].reverse();
    let maxSocketByLevel = (
      sockets.find((s) => s.minLevel <= dropLevel) as ItemSocket
    ).number;
    let maxSocketItem = 0;
    if ([...this.oneHandWeapons, 'Shields'].includes(itemClass)) {
      maxSocketItem = 3;
    } else if (
      this.twoHandWeapons.includes(itemClass) ||
      itemClass === 'Body Armours'
    ) {
      maxSocketItem = 6;
    } else if (['Boots', 'Gloves', 'Helmets'].includes(itemClass)) {
      maxSocketItem = 4;
    }
    return Math.min(maxSocketByLevel, maxSocketItem);
  }

  filterItemsByArmourTypeAndClass(
    items: Item[],
    armourType: string,
    armourClass: string
  ) {
    return items.filter((item) => {
      const matchStr =
        armourType === 'str' &&
        item.requiredStrength &&
        !item.requiredDexterity &&
        !item.requiredIntelligence;
      const matchDex =
        armourType === 'dex' &&
        !item.requiredStrength &&
        item.requiredDexterity &&
        !item.requiredIntelligence;
      const matchInt =
        armourType === 'int' &&
        !item.requiredStrength &&
        !item.requiredDexterity &&
        item.requiredIntelligence;
      const matchStrDex =
        armourType === 'strDex' &&
        item.requiredStrength &&
        item.requiredDexterity &&
        !item.requiredIntelligence;
      const matchStrInt =
        armourType === 'strInt' &&
        item.requiredStrength &&
        !item.requiredDexterity &&
        item.requiredIntelligence;
      const matchDexInt =
        armourType === 'dexInt' &&
        !item.requiredStrength &&
        item.requiredDexterity &&
        item.requiredIntelligence;
      return (
        item.class === armourClass &&
        (matchStr ||
          matchDex ||
          matchInt ||
          matchStrDex ||
          matchStrInt ||
          matchDexInt)
      );
    });
  }
}
