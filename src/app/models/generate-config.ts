export interface GenerateFlaskConfig {
  classes: string[];
}

export interface GenerateItemConfig {
  minSockets: number;
  minLinks: number;
  sockets: number;
  links: number;
}

export interface GenerateWeaponConfig extends GenerateItemConfig {
  classes: string[];
}

export interface GenerateArmourConfig extends GenerateItemConfig {
  types: string[];
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
  chromaticSizes: string[];
  rareSizes: string[];
  minQualityFlask: number;
  minQualityGem: number;
}
