const Settings = {
  // API server address, defaults to a stored value or a predefined URL
  ApiDomain: typeof window !== 'undefined' ? localStorage.getItem("ApiDomain") || "http://localhost:3001/api" : "http://localhost:3001/api",
  
  // Cache keys
  CacheKeys: {
    PRIVATE: 'privatePersonList',
    PUBLIC: 'publicPersonList',
  }
};

export default Settings;
