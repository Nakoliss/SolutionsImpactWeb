import { forwardRef } from 'react';
import type {
  ChangeEvent,
  ClipboardEvent,
  FocusEventHandler,
  InputHTMLAttributes,
} from 'react';

type PhoneInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange'
> & {
  value: string;
  onChange: (value: string) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
};

function formatPhoneNumber(rawValue: string): string {
  const digits = rawValue.replace(/\D/g, '').slice(0, 10);

  if (digits.length === 0) {
    return '';
  }

  if (digits.length < 4) {
    const prefix = `(${digits}`;
    return digits.length === 3 ? `${prefix})` : prefix;
  }

  if (digits.length < 7) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      value,
      onChange,
      placeholder = '',
      className,
      onBlur,
      autoComplete = 'tel',
      inputMode = 'tel',
      ...rest
    },
    ref,
  ) => {
    const formattedValue = formatPhoneNumber(value);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = formatPhoneNumber(event.target.value);
      onChange(nextValue);
    };

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      const pastedData = event.clipboardData.getData('text');
      const nextValue = formatPhoneNumber(pastedData);
      onChange(nextValue);
    };

    return (
      <input
        {...rest}
        ref={ref}
        type="tel"
        value={formattedValue}
        onChange={handleChange}
        onPaste={handlePaste}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={className}
        pattern="\\(\\d{3}\\) \\d{3}-\\d{4}"
      />
    );
  },
);

PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };

