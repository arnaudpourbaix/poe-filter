export interface ItemView {
  label: string;
  value: string;
}

export interface SectionForm {
  selection: boolean[];
  minSockets: number;
  minLinks: number;
  sockets: number;
  links: number;
  normal: boolean;
  magic: boolean;
  rare: boolean;
}
