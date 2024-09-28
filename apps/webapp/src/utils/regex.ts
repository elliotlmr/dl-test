export const regex = {
  email:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()-_=+[\]{}|;:'",.<>/?`~]{8,}$/,
  phone: /^[0-9]+$/,
  names: /^[a-zA-Z]+$/,
};
