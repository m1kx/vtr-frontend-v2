import PocketBase from "pocketbase";

const pb = new PocketBase(`https://api.mikaco.de:443`);
const authStore = reactive(pb.authStore);

export const useUser = () => {
  return useState("user", () => pb.authStore.model);
};

export const usePocketbase = () => {
  return pb;
};

export const useAuthstore = () => {
  return authStore;
};

export const logout = () => {
  pb.authStore.clear();
};
