<script setup lang='ts'>
const pb = usePocketbase();
const toast = useToast();
const user = useUser();

const loading = ref(false);

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

const subscribe = async () => {
  if (!pb.authStore.model) return;
  try {
    const registration = await navigator.serviceWorker.ready
    const vapidPublicKey = 'BOYI_ijgk8RgymTmVmEu9_Kmtpun5-R790EByhTQ26Ba33WRo3LOg93BhUAFD3cvnVaCCR9tyH1lMiN8xuDlDbA';
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
    await pb.collection('users').update(pb.authStore.model.id, { "notifications": JSON.stringify(subscription) });
    return true
  } catch (error) {
    toast.add({
      title: 'Version nicht unterstützt / abgelent'
    })
    return false
  }
}

const add_notifications = async () => {
  if (!pb.authStore.model) return;
  loading.value = true;
  navigator.serviceWorker.register('service-worker.js');
  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    const success = await subscribe();
    toast.add({
      title: (success) ? 'Benachrichtigungen aktiviert!' : 'Fehler beim aktivieren der Benachrichtigungen'
    })
    loading.value = false;
  } else {
    await pb.collection('users').update(pb.authStore.model.id, { "notifications": JSON.stringify(subscription) });
    toast.add({
      title: 'Benachrichtigungen aktiviert!'
    })
    loading.value = false;
  }
}

const disable_push = async () => {
  if (!pb.authStore.model) return;
  loading.value = true;
  try {
    await pb.collection('users').update(pb.authStore.model.id, { notifications: '' });
    toast.add({
      title: 'Disabled Notifications!'
    })
    loading.value = false;
  } catch (e) {
    toast.add({
      title: 'Failed to disable Notifications!'
    })
    loading.value = false;
  }
}
</script>

<template>
  <div class='pt-5' v-if='pb.authStore.model'>
    <UButton v-if='!pb.authStore.model.notifications' @click='add_notifications()' :loading='loading'>Aktiviere
      Push-Benachrichtigungen</UButton>
    <UButton v-else :loading='loading' @click='disable_push()' color="red">Deaktiviere Push-Benachrichtigungen</UButton>
  </div>
</template>
