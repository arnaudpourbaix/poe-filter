import { Size } from './size';

export interface GenerateFlaskConfig {
  classes: string[];
}

export interface GenerateWeaponConfig {
  classes: string[];
  minSockets: number;
  minLinks: number;
  minSocketsHighlight: boolean;
  minLinksHighlight: boolean;
}

export interface GenerateArmourConfig {
  types: string[];
  minSockets: number;
  minLinks: number;
  minSocketsHighlight: boolean;
  minLinksHighlight: boolean;
}

export interface GenerateConfig {
  oneHandWeapons: GenerateWeaponConfig;
  twoHandWeapons: GenerateWeaponConfig;
  bodyArmours: GenerateArmourConfig;
  helmets: GenerateArmourConfig;
  gloves: GenerateArmourConfig;
  boots: GenerateArmourConfig;
  shields: GenerateArmourConfig;
  flasks: GenerateFlaskConfig;
  belts: string[];
  rings: string[];
  amulets: string[];
  chromatics: string[];
  minQualityRecipe: number;
}
