import { fetchUsers } from "./functions.js";

const createnotification = () => {
  return new Promise(async (resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        console.log("chckeing");
        const users = await fetchUsers();
        const activeUser = JSON.parse(localStorage.getItem("user"));

        if (!activeUser) return;

        const user = users.find((el) => el.tag === activeUser.tag);

        if (user.recieveconf === true) {
          if (user.master === true) {
            document.querySelector(
              ".completed-message"
            ).innerHTML = `You received $${user.received.amount} from ${user.received.from} `;
          } else {
            document.querySelector(
              ".completed-message"
            ).innerHTML = `You received $${user.pendingPayment.amount} from ${user.pendingPayment.from} `;
          }
          document.querySelector(".completed-notification").style = "top:10px";
          user.recieveconf = false;
          clearInterval(interval);
          resolve(user.received);

          const response = await fetch(
            "https://api.jsonbin.io/v3/b/68e6fe61d0ea881f409a63ea",
            {
              method: "PUT",
              headers: {
                "X-MASTER-KEY":
                  "$2a$10$AL1ZZvl9kra1EIG8aJHskO9NEcTS1H9WPZI3EPV4rxrWyaKRYmT6e",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(users),
            }
          );
          location.reload();
        }
      } catch (err) {
        clearInterval(interval);
        reject(err);
      }
    }, 5000);
  });
};
const receivedMoney = async () => {
  const receivedfrom = await createnotification();
  if (receivedfrom) {
  }
};
export { receivedMoney };
