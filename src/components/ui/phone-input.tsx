
import React from 'react';
import PhoneInputWithCountrySelect from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, disabled, className, placeholder = "e.g. +44 7123 456789", ...props }, ref) => {
    return (
      <div className={cn("relative", className)}>
        <PhoneInputWithCountrySelect
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          defaultCountry="US"
          countryCallingCodeEditable={false}
          international
          withCountryCallingCode
          className="phone-input-custom"
          inputComponent={React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
            ({ className, ...props }, ref) => (
              <input
                ref={ref}
                className={cn(
                  "flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                  className
                )}
                {...props}
              />
            )
          )}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
