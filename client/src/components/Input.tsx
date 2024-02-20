interface InputProps {
  label: string;
  type: string;
  id: string;
  name: string;
  className: string;
  value?: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  label,
  type,
  name,
  onChange,
  value,
}: InputProps) {
  return (
    <div>
      <label htmlFor="">{label}</label>
      <input
        type={type}
        name={name}
        onChange={(event) => onChange(event)}
        value={value}
      />
    </div>
  );
}
