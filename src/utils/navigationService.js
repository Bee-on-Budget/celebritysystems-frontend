let navigator;

export const setNavigator = (nav) => {
  navigator = nav;
};

export const navigate = (path) => {
  if (navigator) navigator(path);
  else {
    console.warn('Navigator not initialized - using window.location');
    window.location.href = path;
  }
};