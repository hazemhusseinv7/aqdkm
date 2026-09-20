/** Use instead of HeroUI FieldError outside a field wrapper (it only renders inside one). */
export function FieldMessage({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="text-danger text-xs leading-6 font-medium">
      {children}
    </p>
  );
}
