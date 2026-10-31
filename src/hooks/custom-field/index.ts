import { iCustomFieldProps } from '@/models/custom-field';
import { useFormContext } from 'react-hook-form';

interface iUseCustomFieldProps {
  setFieldToEdit: (value: string) => void;
  setOpenSheet: (open: boolean) => void;
}

interface iUpdateFieldsProps {
  idOrValue: string;
  fieldForm: string;
  keepIndex?: number;
}

export const useCustomField = ({
  setFieldToEdit,
  setOpenSheet,
}: iUseCustomFieldProps) => {
  const methods = useFormContext();

  const updateFields = ({
    idOrValue,
    fieldForm,
    keepIndex,
  }: iUpdateFieldsProps) => {
    const currentFields = methods.getValues(fieldForm);
    return currentFields.filter(
      (field: string, index: number) =>
        field !== idOrValue || index === keepIndex
    );
  };

  const handleCustomField = async ({
    idOrValue,
    oldIdOrValue,
    fieldForm,
    action,
  }: iCustomFieldProps) => {
    if (action === 'edit' || action === 'new') {
      const newIdOrValue = idOrValue ?? '';
      setFieldToEdit(newIdOrValue);
      setOpenSheet(true);
      return;
    }

    if (idOrValue && fieldForm) {
      // DELETE
      if (action === 'delete') {
        const updatedFields = updateFields({ fieldForm, idOrValue });
        methods.setValue(fieldForm, updatedFields);
        return;
      }

      // EDIT
      if (oldIdOrValue) {
        const currentData = methods.getValues(fieldForm);
        const newIndex = currentData.indexOf(idOrValue);
        const oldIndex = currentData.indexOf(oldIdOrValue);

        if (newIndex === oldIndex) return;
        const updatedFields = updateFields({
          fieldForm,
          idOrValue,
          keepIndex: oldIndex,
        });

        const keptIndex = updatedFields.indexOf(oldIdOrValue);
        if (keptIndex >= 0) updatedFields[keptIndex] = idOrValue;
        methods.setValue(fieldForm, updatedFields);

        return;
      }

      // INSERT
      const updatedFields = updateFields({ fieldForm, idOrValue });
      methods.setValue(fieldForm, [idOrValue, ...updatedFields]);
    }
  };

  return { handleCustomField };
};
