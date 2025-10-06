import type { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, error, className, ...props }) => (
  <div className="mb-4">
    <label className="form-label">{label}</label>
    <input
      className={`form-input ${error ? 'error' : ''} ${className || ''}`}
      {...props}
    />
    {error && <p className="form-error">{error}</p>}
  </div>
);

export default FormInput;