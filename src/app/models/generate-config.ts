export interface GenerateItemConfig {
  list: string[];
  secondaryList: string[];
  normal: boolean;
  magic: boolean;
  rare: boolean;
}

export interface GenerateSocketItemConfig extends GenerateItemConfig {
  list: string[];
  normal: boolean;
  magic: boolean;
  rare: boolean;
  minSockets: number;
  minLinks: number;
  maxSockets: number;
}

export interface GenerateConfig {
  oneHandWeapons: GenerateSocketItemConfig;
  twoHandWeapons: GenerateSocketItemConfig;
  bodyArmours: GenerateSocketItemConfig;
  helmets: GenerateSocketItemConfig;
  gloves: GenerateSocketItemConfig;
  boots: GenerateSocketItemConfig;
  shields: GenerateSocketItemConfig;
  flasks: GenerateItemConfig;
  belts: GenerateItemConfig;
  rings: GenerateItemConfig;
  amulets: GenerateItemConfig;
  chromaticSizes: string[];
  rareSizes: string[];
  minQualityFlask: number;
  minQualityGem: number;
}
