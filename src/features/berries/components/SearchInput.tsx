import styles from "./SearchInput.module.css";

type Props = {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  ariaLabel?: string;
};

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search by name...",
  autoFocus,
  ariaLabel = "Search berries by name",
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.wrapper}>
      <input
        className={styles.input}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label={ariaLabel}
      />
      {value ? (
        <button
          type="button"
          className={styles.clearBtn}
          onClick={() => onChange("")}
          aria-label="Clear search"
          title="Clear"
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}
