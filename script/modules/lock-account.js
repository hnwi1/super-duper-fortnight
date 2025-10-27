import { viewlockedReceipt } from "./functions.js";
import { fetchUsers } from "./functions.js";

async function lockAccount() {
  let headerInput = document.querySelector("#locked-receipt-message");
  let reasonInput = document.querySelector("#locked-receipt-reason");
  let LpinInput = document.querySelector("#l-pin");
  const Allusers = await fetchUsers();
  const hnwi_id = JSON.parse(localStorage.getItem("getuser"));
  console.log(hnwi_id);
  if (!hnwi_id) {
    document.location = "log.html";
    return;
  }
  let user;
  Allusers.forEach((e) => {
    if (e.hnwi_id === hnwi_id.hnwi) {
      user = e;
    }
  });

  document
    .querySelector("#lock-account")
    .addEventListener("click", async () => {
      let header = headerInput.value.trim();
      let reason = reasonInput.value.trim();
      let Lpin = LpinInput.value.trim();
      console.log("clicked locked");
      if (Lpin === user.pin) {
        let lockedInfo = {
          header,
          reason,
          status: "locked",
        };
        user.locked = lockedInfo;
        const API_KEY =
          "$2a$10$AL1ZZvl9kra1EIG8aJHskO9NEcTS1H9WPZI3EPV4rxrWyaKRYmT6e";
        const API_URL = "https://api.jsonbin.io/v3/b/68e6fe61d0ea881f409a63ea";
        await fetch(`${API_URL}`, {
          method: "PUT",
          headers: {
            "X-MASTER-KEY": API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Allusers),
        });
        location.reload();
      }
    });
}
export { lockAccount };
