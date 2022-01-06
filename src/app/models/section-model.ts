export interface ItemView {
  label: string;
  value: string;
}

export interface SectionForm {
  selection: boolean[];
  minSockets: number;
  minSocketsHighlight: boolean;
  minLinks: number;
  minLinksHighlight: boolean;
}
