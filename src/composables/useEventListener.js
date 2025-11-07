import { onMounted, onUnmounted } from "vue";

/**
 
Composable that manages event listeners with automatic cleanup.
This composable simplifies the process of adding event listeners to DOM elements
or other event targets.
@param { EventTarget } target
@param { string } event
@param { Function } callback*/
export function useEventListener(target, event, callback) {
  onMounted(() => target.addEventListener(event, callback));
  onUnmounted(() => target.removeEventListener(event, callback));
}
