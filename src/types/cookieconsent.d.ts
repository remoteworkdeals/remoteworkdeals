
declare global {
  interface Window {
    cookieconsent: {
      initialise: (config: any) => void;
    };
  }
}

export {};
