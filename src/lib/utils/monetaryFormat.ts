import { currencyFormatter } from './currencyFormatter';

export const monetaryFormat = (value: string) => {
  const onlyDigits = value.replace(/\D/g, '');
  const float = parseFloat(onlyDigits) / 100;
  if (isNaN(float)) return '';

  const formatedValue = currencyFormatter.format(float);

  return formatedValue;
};
