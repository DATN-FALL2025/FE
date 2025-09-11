import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Control } from "react-hook-form";

interface SelectOption {
  id: number | string;
}

interface SelectFormFieldProps<T extends SelectOption> {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  options: T[] | null | undefined;
  loading?: boolean;
  canReview?: boolean;
  renderOption: (option: T) => string;
}

// cách sử dụng khi truyền options -> là 1 list , Thì phải kết hợp renderOption => truyền vô hiển thị tên nhé ...

const SelectFormField = <T extends SelectOption>({
  control,
  name,
  label,
  placeholder = "Select an option",
  options = [],
  loading = false,
  canReview = true,
  renderOption,
}: SelectFormFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            disabled={loading || !canReview}
            onValueChange={(value) => field.onChange(parseInt(value))}
            value={field.value?.toString() || ""}
            defaultValue={field.value?.toString() || ""}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {(options || []).map((option) => (
                <SelectItem key={option.id} value={option.id.toString()}>
                  {renderOption(option)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectFormField;
