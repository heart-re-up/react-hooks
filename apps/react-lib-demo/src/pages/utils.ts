export const extractContent = (element: HTMLElement) => {
  if ("textContent" in element) {
    return element.textContent;
  }
  if ("placeholder" in element) {
    return (element as HTMLInputElement).placeholder;
  }
  if ("href" in element) {
    return (element as HTMLAnchorElement).href;
  }
  return "N/A";
};
