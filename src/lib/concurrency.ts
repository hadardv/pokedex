// this is a limit parallel berry detail requests
// to avoid overwhelming the API server and hitting rate limits

export async function concurrentMap<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let i = 0;

  async function run() {
    while (i < items.length) {
      const cur = i++;
      results[cur] = await fn(items[cur], cur);
    }
  }
  const runners = Array.from({ length: Math.min(limit, items.length) }, run);
  await Promise.all(runners);
  return results;
}
