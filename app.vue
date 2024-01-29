<script setup lang='ts'>
import type { RecordModel, RecordSubscription } from 'pocketbase';

const pb = usePocketbase();
const toast = useToast();

const user = useUser();

const is_refreshing = ref(false);
const initial_refresh = ref(false);
const refresh = async () => {
  if (is_refreshing.value || !pb.authStore.model) return;
  is_refreshing.value = true;
  try {
    user.value = (await pb.collection('users').authRefresh()).record;
  } catch (e) {
    let message = 'Unknown Error'
    if (e instanceof Error) message = e.message
    if (!message.includes('The request requires valid record authorization token to be set.')) {
      is_refreshing.value = false;
      return true
    }
    console.log("ERROR")
    console.log(e) // TODO ONLY IF ERROR NOT VALID AUTH
    pb.authStore.clear()
    user.value = pb.authStore.model;
    is_refreshing.value = false;
    return true
  }
  is_refreshing.value = false;
  return true
}

const tab_in = async () => {
  window.removeEventListener('visibilitychange', tab_in);
  if (initial_refresh.value == false) {
    initial_refresh.value = true;
    window.addEventListener('visibilitychange', tab_in);
    return
  } else {
    initial_refresh.value = false;
    window.addEventListener('visibilitychange', tab_in);
  }
  if (!is_refreshing.value)
    await refresh();
}

onMounted(async () => {
  refresh();
  window.addEventListener('visibilitychange', tab_in);
  if (!pb.authStore.model) return;
  await pb.collection('users').subscribe(pb.authStore.model.id, (data: RecordSubscription<RecordModel>) => {
    if (user.value == null) return;
    user.value = data.record;
  });
});

pb.authStore.onChange(async () => {
  if (!is_refreshing.value)
    await refresh();
});


/*const initial_refresh = ref(false);

const refresh_user = async () => {
  if (!pb.authStore.model || is_refreshing.value) return;
  is_refreshing.value = true;
  await pb.collection('users').unsubscribe();
  console.log("refresh")
  try {
    await pb.collection('users').authRefresh();
  } catch (e) {
    console.log("Error")
    console.log(e)
  }
  await pb.collection('users').subscribe(pb.authStore.model.id, refresh_user);
  user.value = pb.authStore.model;
  is_refreshing.value = false;
  initial_refresh.value = true;
  return true
}

onMounted(async () => {
  if (!pb.authStore.model) return;
  await refresh_user();
  await pb.collection('users').subscribe(pb.authStore.model.id, refresh_user);
  window.addEventListener('visibilitychange', () => {
    if (initial_refresh.value)
      refresh_user();
  });
})
pb.authStore.onChange(async () => {
  console.log("change")
  if (!pb.authStore.model) return;
  await pb.collection('users').subscribe(pb.authStore.model.id, refresh_user);
  })*/

useHead({
  title: 'Bot',
  meta: [
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    { name: "apple-mobile-web-app-title", content: "LMG Bot" }
  ],
  link: [
    { rel: "apple-touch-icon", href: "icon.png" },
    { rel: "apple-touch-startup-image", href: "splash.png" }
  ]
});
</script>

<template>
  <div class='w-full flex justify-center'>
    <NuxtPage />
    <UNotifications />
  </div>
</template>
