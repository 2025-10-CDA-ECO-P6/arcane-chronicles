const PLACEHOLDER_IMAGE_URL = 'https://placehold.co/800x450/webp';

export const demoImage = (name?: string) =>
  name ? `/images/demo/${name}.webp` : PLACEHOLDER_IMAGE_URL;
