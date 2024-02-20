interface OptionProps {
  value: string;
  text: string;
}

function Option({ value, text }: OptionProps) {
  return <option value={value}>{text}</option>;
}

export default function Select() {
  return (
    <select>
      <Option value={"invoice"} text={"Facture"} />
      <Option value={"estimate"} text={"Devis"} />
    </select>
  );
}
