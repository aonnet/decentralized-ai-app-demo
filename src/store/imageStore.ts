import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useImageStore = defineStore('imageStore', () => {
  const uploadedImageUrl = ref<string>('');

  const addImage = (image: string) => {
    uploadedImageUrl.value = image
  };

  const removeImage = () => {
    uploadedImageUrl.value = '';
  };

  return { uploadedImageUrl, addImage, removeImage };
});