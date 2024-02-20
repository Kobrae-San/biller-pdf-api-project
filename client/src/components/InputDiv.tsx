interface InputDivProps {
  title: string;
}

export default function InputDiv({ title }: InputDivProps) {
  return (
    <section>
      <h1>{title}</h1>
    </section>
  );
}
