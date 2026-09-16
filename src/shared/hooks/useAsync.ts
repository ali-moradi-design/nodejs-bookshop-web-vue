import { onMounted, ref, type Ref, watch, type WatchSource } from 'vue';

export function useAsync<T>(
  fn: () => Promise<T>,
  options: { immediate?: boolean; watch?: WatchSource[] } = {},
) {
  const data = ref<T | null>(null) as Ref<T | null>;
  const error = ref<Error | null>(null);
  const loading = ref(false);

  const execute = async () => {
    loading.value = true;
    error.value = null;
    try {
      data.value = await fn();
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
    } finally {
      loading.value = false;
    }
  };

  if (options.immediate !== false) {
    onMounted(execute);
  }

  if (options.watch) {
    watch(options.watch, () => {
      void execute();
    });
  }

  return { data, error, loading, reload: execute };
}
