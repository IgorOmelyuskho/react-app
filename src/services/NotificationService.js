import { store } from 'react-notifications-component';

export function notify(message = 'EMPTY MESSAGE', duration = 5000, title) {
  store.addNotification({
    title: title,
    message: message,
    type: "info",
    insert: "bottom",
    container: "bottom-center",
    animationIn: ["animated", "flipInY"],
    animationOut: ["animated", "flipOutY"],
    dismiss: {
      duration: duration,
      onScreen: false
    }
  });
}