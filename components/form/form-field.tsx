import React, { InputHTMLAttributes } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

export interface FormFieldCustomProps
  extends InputHTMLAttributes<HTMLInputElement> {
  control: Control<any>;
  name: string;
  label: string;
  classNameItem?: string;
}

const FormFieldCustom = ({
  control,
  name,
  label,
  classNameItem = "",
  ...inputProps
}: FormFieldCustomProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={classNameItem}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...inputProps} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormFieldCustom;
