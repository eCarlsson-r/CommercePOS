// Dummy server entry to satisfy Vite build environment compilation
export default function render(url: string, document: string) {
  return Promise.resolve(document);
}
