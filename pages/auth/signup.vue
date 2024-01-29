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

const options = [
  { label: 'EF', value: 'EF' },
  { label: 'Q1', value: 'Q1' },
  { label: 'Q2', value: 'Q2' }
]

const state = reactive({
  email: undefined,
  password: undefined,
  password_confirm: undefined,
  radio: undefined,
})

const schema = object({
  email: string().email('Invalid email').required('Required'),
  password: string()
    .min(8, 'Must be at least 8 characters')
    .required('Required'),
  password_confirm: string()
    .min(8, 'Must be at least 8 characters')
    .test('password-match', 'Passwords must match', (value) => {
      return value === state.password
    })
    .required('Required'),
  radio: string()
    .test('class-chosen', 'Bitte Stufe auswählen', (value) => {
      console.log(value)
      return value != ''
    })
    .required('Required')
})

type Schema = InferType<typeof schema>

const on_submit = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true;
  try {
    await pb.collection('users').create({
      email: event.data.email,
      password: event.data.password,
      passwordConfirm: event.data.password_confirm,
      class: state.radio
    })
    const record = await pb.collection('users').authWithPassword(event.data.email, event.data.password);
    try {
      await pb.collection('users').requestVerification(record.record.email);
      toast.add({
        title: `Bestätigungsmail an ${record.record.email} gesendet!`
      })
    } catch (e) {
      toast.add({
        title: 'Fehler beim senden der Bestätigungsmail'
      })
    }
    toast.add({
      title: 'Erfolgreich Registriert!'
    });
    loading.value = false;
    navigateTo('/');
  } catch (e) {
    toast.add({
      title: 'Fehler beim registrieren!',
      description: 'Versuche es später erneut'
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
        <UFormGroup label="Passwort Confirm" name="password_confirm">
          <UInput v-model='state.password_confirm' type="password" color="violet" placeholder="" />
        </UFormGroup>
        <UFormGroup name="class" label="Stufe">
          <URadio v-for="option in options" :key="option.value" v-model="state.radio" v-bind="option">
            {{ option.label }}
          </URadio>
        </UFormGroup>
        <UButton color="violet" :loading='loading' type="submit">Account Erstellen</UButton>
      </UForm>
    </div>
  </div>
</template>
