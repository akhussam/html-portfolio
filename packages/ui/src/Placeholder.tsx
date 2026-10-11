export interface PlaceholderProps {
  title: string;
}

/** Temporary empty-state component until step 0.8 ships the real component set. */
export function Placeholder({ title }: PlaceholderProps) {
  return <h1>{title}</h1>;
}
