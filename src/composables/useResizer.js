import { ref } from "vue";
import { useEventListener } from "./useEventListener";

/**
 * Composable that calculates a responsive resize scale factor based on viewport dimensions.
 *
 * We hate media queries here ^^
 *
 * This composable automatically adjusts the scale factor when the window is loaded or resized,
 * maintaining aspect ratio relative to a 1920x1080 reference resolution.
 *
 * @returns {{ resize: Ref<number> }}
 */
export function useResizer() {
  const resize = ref(0);

  const handleResize = () => {
    const width = document.body.clientWidth / 1920;
    const height = document.body.clientHeight / 1080;

    resize.value = width < height ? width : height;
    document.documentElement.style.setProperty("--app-resize", resize.value);
  };

  useEventListener(window, "load", handleResize);
  useEventListener(window, "resize", handleResize);

  return { resize };
}
