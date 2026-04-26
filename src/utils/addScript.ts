export const addScript = (src: string, type = 'text/javascript') => {
  return new Promise<HTMLScriptElement>((resolve, reject) => {
    const script = document.createElement('script');
    script.type = type;
    script.src = src;

    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

    document.head.appendChild(script);
  });
};
