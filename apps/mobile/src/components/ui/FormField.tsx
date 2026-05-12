import {
  type ReactNode,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type SelectHTMLAttributes,
  type FormHTMLAttributes,
} from "react";
import clsx from "clsx";

interface ModalFormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

export const ModalForm = ({ children, className, ...props }: ModalFormProps) => (
  <form className={clsx("space-y-4", className)} {...props}>
    {children}
  </form>
);

const labelClass = "block text-xs font-medium text-text-secondary mb-1";
const controlClass =
  "w-full rounded-lg border border-default bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-focus";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export const Field = ({ id, label, className, ...props }: FieldProps) => (
  <div>
    <label htmlFor={id} className={labelClass}>
      {label}
    </label>
    <input id={id} className={clsx(controlClass, className)} {...props} />
  </div>
);

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
}

export const TextareaField = ({ id, label, className, ...props }: TextareaFieldProps) => (
  <div>
    <label htmlFor={id} className={labelClass}>
      {label}
    </label>
    <textarea id={id} className={clsx(controlClass, className)} {...props} />
  </div>
);

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  children: ReactNode;
}

export const SelectField = ({ id, label, className, children, ...props }: SelectFieldProps) => (
  <div>
    <label htmlFor={id} className={labelClass}>
      {label}
    </label>
    <select id={id} className={clsx(controlClass, className)} {...props}>
      {children}
    </select>
  </div>
);
