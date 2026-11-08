export const forEachInBatches = async <T>(items: T[], visit: (item: T) => void) => {
  // shortcut: one large polygon is still synchronous; simplify geometry if it keeps stalling.
  for (let index = 0; index < items.length; index++) {
    if (index % 8 === 0) {
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    }
    visit(items[index]);
  }
};
