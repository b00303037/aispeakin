export type OptionList<T> = Array<Option<T>>;

interface Option<T> {
  label: string;
  value: T;
}
