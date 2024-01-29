<script setup lang='ts'>
const pb = usePocketbase();
const toast = useToast();
const user = useUser();

const score_name = ref('');

type ScoreItem = {
  id: String;
  score: Number;
  class: String | undefined;
}

const score_list = ref<ScoreItem[]>();
const refresh_list = async () => {
  const { data, pending, error, refresh } = await useFetch('https://api.mikaco.de:443/score', {
    method: 'get'
  });
  score_list.value = data.value as ScoreItem[];
  for (let i = 0; i < score_list.value.length; i++) {
    if (!pb.authStore.model) continue;
    if (score_list.value[i].id == pb.authStore.model.score_name) {
      score_list.value[i] = {
        id: score_list.value[i].id,
        score: score_list.value[i].score,
        class: 'bg-green-500/50 dark:bg-green-400/50 text-black animate-pulse selfscore'
      }
    }
  }
}
onMounted(async () => {
  refresh_list();
})

watch(user, () => {
  refresh_list();
}, {
  deep: true
})

const columns = [
  {
    key: 'id',
    label: ''
  },
  {
    key: 'score',
    label: ''
  }
];

const name = ref('');
const update_name = async () => {
  if (name.value == '') {
    toast.add({
      title: 'Name darf nicht leer sein!'
    })
    return;
  }
  if (!pb.authStore.model) return;
  try {
    await pb.collection('users').update(pb.authStore.model.id, {
      score_name: name.value
    });
    toast.add({
      title: 'Name erfolgreich geändert!'
    });
    const { data, pending, error, refresh } = await useFetch('https://api.mikaco.de:443/score', {
      method: 'get'
    });
    score_list.value = data.value as ScoreItem[];
  } catch (e) {
    toast.add({
      title: 'Fehler beim ändern des Namens!'
    });
  }
}

watch(user, () => {
  if (!pb.authStore.model) return;
  if (!user.value) return;
  score_name.value = user.value.score_name;
}, {
  deep: true
});

onMounted(() => {
  if (!pb.authStore.model) return;
  score_name.value = pb.authStore.model.score_name;
})

</script>

<template>
  <div class='relative'>
    <div class='h-56 overflow-scroll'>
      <UTable :rows='score_list' :columns='columns' />
    </div>
    <div class='h-56 flex justify-center flex-col items-center w-full absolute top-0 backdrop-blur-md' v-if='!score_name'>
      <div class='w-9/12'>
        <label class='text-xs leading-none' for="name">Namen angeben, um den Score der anderen User zu sehen:</label>
        <div class='flex gap-2'>
          <UInput v-model='name' id="name" placeholder="Max M." />
          <UButton @click='update_name()'>Ok</UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss'>
.selfscore {
  td {
    color: #000 !important;
  }
}
</style>
