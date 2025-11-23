type PageModule = {
  default: React.ComponentType<any>;
};

const importAllPages = (r: __WebpackModuleApi.RequireContext) => {
  const pages: Record<string, React.ComponentType<any>> = {};

  r.keys().forEach((key: string) => {
    const fileName = key.replace("./", "").replace(/\.(tsx|jsx|ts|js)$/, "");

    const module = r(key) as PageModule;
    pages[fileName] = module.default;
  });

  return pages;
};

export default importAllPages;
