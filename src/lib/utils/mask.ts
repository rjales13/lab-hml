export const applyMask = (value: string, mask: string) => {
  const cleaned = value.replace(/\D/g, '');
  const isPhone = mask === '(##) #####-####';
  const isNotMobile = cleaned.length === 10;
  const setMask = isPhone && isNotMobile ? '(##) ####-####' : mask;

  let maskedValue = '';
  let maskIndex = 0;

  for (let i = 0; i < cleaned.length; i++) {
    if (maskIndex >= setMask.length) break; // Para se a máscara estiver completa

    const currentChar = setMask[maskIndex];

    if (currentChar === '#') {
      maskedValue += cleaned[i]; // Adiciona o número
      maskIndex++;
    } else {
      maskedValue += currentChar; // Adiciona o caractere da máscara
      maskIndex++;
      i--; // Não avança no índice do número
    }
  }

  return maskedValue;
};
