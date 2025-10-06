import type { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', loading, className, ...props }) => {
  const variantClass = variant === 'primary' ? 'btn-primary' : variant === 'secondary' ? 'btn-secondary' : 'btn-danger';
  return (
    <button
      className={`${variantClass} ${className || ''}`}
      disabled={loading}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : children}
    </button>
  );
};

export default Button;