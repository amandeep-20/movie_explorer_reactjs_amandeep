// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface Notification {
//   id: number;
//   message: string;
//   timestamp: string;
//   read: boolean;
// }

// interface NotificationState {
//   notifications: Notification[];
//   notificationCount: number;
// }

// const initialState: NotificationState = {
//   notifications: [],
//   notificationCount: 0,
// };

// const notificationSlice = createSlice({
//   name: "notifications",
//   initialState,
//   reducers: {
//     addNotification(state, action: PayloadAction<Notification>) {
//       state.notifications.push(action.payload);
//       if (!action.payload.read) {
//         state.notificationCount += 1;
//       }
//     },
//     markAllNotificationsRead(state) {
//       state.notifications = state.notifications.map((notification) => ({
//         ...notification,
//         read: true,
//       }));
//       state.notificationCount = 0;
//     },
//     clearNotifications(state) {
//       state.notifications = [];
//       state.notificationCount = 0;
//     },
//   },
// });

// export const { addNotification, markAllNotificationsRead, clearNotifications } =
//   notificationSlice.actions;
// export default notificationSlice.reducer;