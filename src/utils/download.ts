export const download = (content: string, fileName: string, type = 'text/plain') => {
  const a = document.createElement('a');
  const file = new Blob([content], { type });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
};
