<script setup lang='ts'>
import utf8 from 'utf8';

const pb = usePocketbase();

const user = useUser();

onMounted(() => {
  if (!pb.authStore.model) return;
  fmt_data();
});

watch(user, () => {
  fmt_data();
}, {
  deep: true
})

const tday = ref(atob(pb.authStore.model?.h_hash))
const tday_formatted = ref([]);
const tmrw = ref(atob(pb.authStore.model?.m_hash))
const tmrw_formatted = ref([]);


const fmt_data = () => {
  if (!pb.authStore.model) return;
  if (!user.value) return;
  let actions_h = utf8.decode(atob(user.value.h_hash)).split("!!!");
  let actions_m = utf8.decode(atob(user.value.m_hash)).split("!!!");
  let new_actions_h = [];
  let new_actions_m = [];
  for (let i = 0; i < actions_h.length; i++) {
    if (actions_h[i] == '') continue;
    const all = actions_h[i].split("|");
    new_actions_h.push({
      subject: all[3],
      room: all[4],
      type: all[2]
    })
  }
  for (let i = 0; i < actions_m.length; i++) {
    if (actions_m[i] == '') continue;
    const all = actions_m[i].split("|")
    new_actions_m.push({
      subject: all[3],
      room: all[4],
      type: all[2]
    })
  }
  tday_formatted.value = new_actions_h as []
  tmrw_formatted.value = new_actions_m as []
}

const columns = [
  {
    key: 'subject',
    label: 'Fach'
  },
  {
    key: 'room',
    label: 'Raum'
  },
  {
    key: 'type',
    label: 'Art'
  }
];
</script>

<template>
  <div>
    <div>
      <div class='pt-3'>
        <h5 class='text-indigo-200 underline'>Heute</h5>
        <UTable v-if='tday_formatted.length > 0' :rows='tday_formatted' :columns='columns' />
        <h3 class='pt-2' v-else>Kein Entfall</h3>
      </div>
      <div class='pt-3'>
        <h5 class='text-indigo-200 underline'>Morgen</h5>
        <UTable v-if='tmrw_formatted.length > 0' :rows='tmrw_formatted' :columns='columns' />
        <h3 v-else>Kein Enfall</h3>
      </div>
    </div>
  </div>
</template>
