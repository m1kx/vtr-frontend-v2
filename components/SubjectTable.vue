<script setup lang='ts'>
const pb = usePocketbase();
const user = useUser();
const toast = useToast();

const loading = ref(false);

onMounted(() => {
  if (!pb.authStore.model) return;
  refresh_rows();
});

watch(user, () => {
  refresh_rows();
}, {
  deep: true
})

const remove_subject = async (item: RowItem) => {
  if (!pb.authStore.model) return;
  loading.value = true;
  let new_subjects = '';
  if (pb.authStore.model.subjects.includes(`${item.subject} ${item.course}:`)) {
    new_subjects = pb.authStore.model.subjects.replace(`${item.subject} ${item.course}:`, '')
  } else {
    new_subjects = pb.authStore.model.subjects.replace(`:${item.subject} ${item.course}`, '')
  }
  try {
    await pb.collection('users').update(pb.authStore.model.id, {
      subjects: new_subjects
    });
    toast.add({
      title: 'Fächer erfolgreich aktualisiert!'
    });
    loading.value = false;
  } catch (e) {
    toast.add({
      title: 'Fehler beim aktualisieren der Fächer!'
    });
    loading.value = false;
  }
}

const add_subject_in = ref('');
const add_course_in = ref('');
const add_subject = async () => {
  if (!pb.authStore.model) return;
  loading.value = true;
  try {
    await pb.collection('users').update(pb.authStore.model.id, {
      subjects: `${pb.authStore.model.subjects}${pb.authStore.model.subjects ? ':' : ''}${add_subject_in.value} ${add_course_in.value}`
    });
    toast.add({
      title: 'Fächer erfolgreich aktualisiert!'
    });
    loading.value = false;
  } catch (e) {
    toast.add({
      title: 'Fehler beim aktualisieren der Fächer!'
    });
    loading.value = false;
  }
  add_subject_in.value = '';
  add_course_in.value = '';
}

type RowItem = {
  index: number;
  subject: String;
  course: String;
}

const rows = ref<RowItem[]>([]);

const refresh_rows = () => {
  if (!pb.authStore.model) return [];
  if (!user.value) return;
  const subjects = user.value.subjects.split(':')
  const new_rows: RowItem[] = [];
  for (let i = 0; i < subjects.length; i++) {
    new_rows.push({
      index: i,
      subject: subjects[i].split(' ')[0] as String,
      course: subjects[i].split(' ')[1] as String
    } as RowItem);
  }
  rows.value = new_rows;
}
const columns = [
  {
    key: 'subject',
    label: 'Fach'
  },
  {
    key: 'course',
    label: 'Kurs'
  },
  {
    key: 'actions'
  }
];

const items = (row: RowItem) => [
  [{
    label: 'Entfernen',
    icon: 'i-heroicons-trash-20-solid',
    click: () => { remove_subject(row) }
  }]
]
</script>

<template>
  <div class='flex w-full flex-col justify-center items-center pt-3'>
    <UTable class='w-full' :rows='rows' :columns='columns' @select=''>
      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
        </UDropdown>
      </template>
    </UTable>
    <div class='flex gap-1 justify-center pt-3 w-full'>
      <UInput placeholder="Fach z.B. GE" v-model='add_subject_in' class='w-4/12' />
      <UInput placeholder="Kurs z.B. G1" v-model='add_course_in' class='w-4/12' />
      <UButton class='w-4/12 justify-center' @click='add_subject()' :loading='loading'>Hinzufügen</UButton>
    </div>
  </div>
</template>

<style lang='scss'>
</style>
