export interface iCustomFieldProps {
  oldIdOrValue?: string;
  idOrValue?: string;
  fieldForm?: string;
  action: 'new' | 'save' | 'edit' | 'delete';
}
