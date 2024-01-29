<script setup lang='ts'>
const pb = usePocketbase();
const user = useUser();
const toast = useToast();

const logout = () => {
  pb.authStore.clear();
  user.value = pb.authStore.model;
}

const resend_verification = async () => {
  if (!pb.authStore.model) return;
  try {
    await pb.collection('users').requestVerification(pb.authStore.model.email);
    toast.add({
      title: 'Neue Bestätigungsmail gesendet!'
    })
  } catch (e) {
    toast.add({
      title: 'Fehler beim senden der Bestätigungsmail'
    })
  }
}
</script>

<template>
  <div class='flex w-full max-w-3xl flex-col ' v-if='user && user.verified'>
    <div class='p-5'>
      <h1 class='text-xl font-extrabold'>Dein Vertretungsplan</h1>
      <PlanDisplay />
    </div>
    <div class='p-5'>
      <h1 class='text-xl font-extrabold'>Push-Benachrichtigungen</h1>
      <PushNotify />
    </div>
    <div class='p-5'>
      <h3 class='text-xl font-extrabold'>EVA-Score</h3>
      <EvaScore />
    </div>
    <div class='p-5'>
      <h3 class='text-xl font-extrabold'>Fächer bearbeiten</h3>
      <SubjectTable />
    </div>
    <div class='p-5 w-full'>
      <UButton class='w-full text-center justify-center' color='red' @click='logout()'>Abmelden</UButton>
    </div>
  </div>
  <div v-else-if="user && !user.verified" class='w-screen h-screen max-w-3xl flex justify-center items-center'>
    <div class='w-8/12 text-center'>
      Bestätige die email <a>{{ user.email }}</a> und lade die Seite neu
      <UButton class='mt-4' @click='resend_verification()'>Erneut senden</UButton>
    </div>
  </div>
  <div v-else class='p-5 h-screen w-screen max-w-3xl flex justify-center items-center'>
    <div class='flex flex-col justify-center max-w-3xl items-center'>
      <UButton @click='navigateTo("/auth/login")'>Anmelden</UButton>
      <p class='p-3'>oder</p>
      <UButton @click='navigateTo("/auth/signup")'>Registrieren</UButton>
    </div>
  </div>
</template>
