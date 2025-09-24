import styles from "./EmptyState.module.css";

export default function EmptyState({ query }: { query?: string }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>No berries found</div>
      <div className={styles.note}>
        {query ? `Try different search than "${query}"` : "No items to show"}
      </div>
    </div>
  );
}
