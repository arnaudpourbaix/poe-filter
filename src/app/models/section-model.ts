export interface ItemView {
  label: string;
  value: string;
}

export interface SectionForm {
  selection: boolean[];
  secondarySelection: boolean[];
  minSockets: number;
  minLinks: number;
  normal: boolean;
  magic: boolean;
  rare: boolean;
}
