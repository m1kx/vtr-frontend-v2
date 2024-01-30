<script setup lang='ts'>
import type { FormError, FormSubmitEvent } from '@nuxt/ui/dist/runtime/types';
import { object, string, type InferType } from 'yup';

const pb = usePocketbase();
const toast = useToast();

const loading = ref(false);

onBeforeMount(() => {
  if (pb.authStore.model) {
    navigateTo('/');
  }
});

const state = reactive({
  email: undefined,
  password: undefined
})

const schema = object({
  email: string().email('Invalid email').required('Required'),
  password: string()
    .min(8, 'Must be at least 8 characters')
    .required('Required')
})

type Schema = InferType<typeof schema>

const on_submit = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true;
  try {
    await pb.collection('users').authWithPassword(event.data.email, event.data.password);
    toast.add({
      title: 'Successfully logged in!'
    });
    loading.value = false;
    navigateTo('/');
  } catch (e) {
    toast.add({
      title: 'Failed to log in!',
      description: 'Check email / password or try again later'
    });
    loading.value = false;
  }
}
</script>

<template>
  <div class='flex w-screen h-screen max-w-xl justify-center items-center'>
    <div class='w-10/12 flex flex-col'>
      <UForm :schema='schema' :state='state' @submit='on_submit' class="space-y-4">
        <UFormGroup label="Email" name="email">
          <UInput v-model='state.email' type="email" color="violet" placeholder="v.nachname@lmg-schulen-willich.de" />
        </UFormGroup>
        <UFormGroup label="Passwort" name="password">
          <UInput v-model='state.password' type="password" color="violet" placeholder="" />
        </UFormGroup>
        <UButton color="violet" :loading='loading' type="submit">LOGIN</UButton>
      </UForm>
    </div>
  </div>
</template>
