export const api = {
  async get<T>(data: T) {
    await new Promise((resolve) => window.setTimeout(resolve, 180));
    return data;
  },
  async patch<T>(data: T) {
    await new Promise((resolve) => window.setTimeout(resolve, 220));
    return data;
  },
  async post<T>(data: T) {
    await new Promise((resolve) => window.setTimeout(resolve, 220));
    return data;
  }
};
