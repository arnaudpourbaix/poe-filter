import { Params } from '@angular/router';

export interface BindQueryParamOptions<T = any> {
  /**
   * Les changements sur le formulaire sont répercutés sur les query params. (false par défaut)
   */
  formToQuery: boolean;
  /**
   * Les query params sont utilisés pour initialiser le formulaire. (true par défaut)
   */
  queryToForm: boolean;
  /**
   * Tous les query params sont des string. Le mapper permet de transformer les types de données pour l'affectation au formulaire.
   */
  formMapper: (queryParams: Params) => Partial<T>;
  /**
   * Permet de convertir les données du formulaire en query params. Utile pour les objets
   */
  queryParamsMapper: (form: Partial<T>) => Params;
  /**
   * Debounce time pour la mise à jour des query params lorsque le formulaire est modifié (300 par défaut)
   */
  debounceTime: number;
  /**
   * Permet de spécifier la liste des query params à inclure
   */
  include?: (keyof T)[];
  /**
   * Permet de spécifier la liste des query params à exclure
   */
  exclude?: (keyof T)[];
}

export const DEFAULT_BIND_QUERY_PARAM_OPTIONS: BindQueryParamOptions = {
  queryToForm: true,
  formToQuery: false,
  formMapper: (p) => p,
  queryParamsMapper: (p) => p,
  debounceTime: 300,
};
