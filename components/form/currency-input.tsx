import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
}

export const CurrencyInput = ({
  value,
  onChange,
  placeholder = "Nhập số tiền",
  className = ""
}: CurrencyInputProps) => {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    // Cập nhật giá trị hiển thị khi value thay đổi từ bên ngoài
    setDisplayValue(value ? formatter.format(value) : "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Loại bỏ tất cả ký tự không phải số
    const rawValue = input.replace(/[^0-9]/g, '');
    
    // Nếu không có số, đặt về 0
    if (rawValue === '') {
      onChange(0);
      return;
    }

    const numberValue = parseInt(rawValue, 10);
    
    // Cập nhật giá trị 
    onChange(numberValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Nếu nhấn backspace khi giá trị là format tiền
    if (e.key === 'Backspace' && displayValue && !displayValue.match(/^[0-9]+$/)) {
      // Xóa toàn bộ giá trị
      onChange(0);
      e.preventDefault();
    }
  };

  return (
    <Input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={`text-left ${className}`}
    />
  );
};