import { showLoader, hideLoader } from "./reloader.js";
import { hideandview } from "./toggle.js";
import {
  searchTag,
  cashPinConfirm,
  dateFormatter,
  timeFormatter,
  viewlockedReceipt,
  fetchUsers,
} from "./functions.js";
function startSend() {
  const ProceedtoPay = document.querySelector("#pay-button");
  ProceedtoPay.addEventListener("click", () => {
    try {
      let sendmoneybutton = document.querySelector(".send-money-button");
      let sendingamountCont = document.querySelector("#sending-amount");
      let sendingamount = document.querySelector("#transfer-amount");
      let cancelSend = document.querySelector("#cancel-send");
      let sendMoney = document.querySelector(".send-money");
      let sendingmoney = Number(sendingamount.innerHTML.replace(/,/g, ""));
      hideandview(cancelSend, false, sendMoney, false, 0);
      ProceedtoPay.classList.add("faded");
      setTimeout(() => {
        ProceedtoPay.classList.remove("faded");
      }, 300);
      if (sendingmoney < 1) {
        document.querySelector(".transfer-screen").classList.add("shake");
        setTimeout(() => {
          document.querySelector(".transfer-screen").classList.remove("shake");
        }, 500);
        return;
      }
      const user = JSON.parse(localStorage.getItem("user"));
      if (user.locked.status === "locked") {
        showLoader();
        setTimeout(() => {
          hideLoader();
        }, 500);
        viewlockedReceipt(user.locked.header, user.locked.reason);

        return;
      }

      if (user.master === false) {
        window.alert(`Restricted! , log in to your app to make transactions"`);
        return;
      }
      showLoader();
      setTimeout(() => {
        hideLoader();
      }, 500);
      sendMoney.classList.remove("hide-item");
      sendMoney.classList.add("view-item");
      sendingamountCont.innerHTML = sendingmoney.toLocaleString();
      searchTag();
      sendmoneybutton.addEventListener("click", async () => {
        if (sendmoneybutton.classList.contains("faded")) {
          return;
        }
        try {
          const payingTo = JSON.parse(localStorage.getItem("sendingdata"));
          const note = document.querySelector("#note");

          if (!note.value.trim()) {
            note.focus();
            note.classList.add("focus-style");
            return;
          }

          const user = JSON.parse(localStorage.getItem("user"));

          document.querySelector(".cash-pin").classList.remove("hide-item");

          const isconfirmed = await cashPinConfirm(user);
          if (isconfirmed) {
            showLoader();

            payingTo.transactiondate = await dateFormatter;
            payingTo.amount = sendingmoney.toLocaleString();
            payingTo.note = note.value;
            payingTo.time = await timeFormatter;
            const thesender = JSON.parse(localStorage.getItem("user"));
            let receieve_user;
            let sender;
            const users = await fetchUsers();
            users.forEach((element) => {
              if (
                element.tag.toLowerCase().trim() ===
                payingTo.tag.trim().toLowerCase()
              ) {
                receieve_user = element;
              }
              if (element.tag === thesender.tag) {
                sender = element;
              }
            });
            console.log(receieve_user);

            console.log(sender);

            receieve_user.recieveconf = true;

            if (receieve_user.master === true) {
              receieve_user.completedPayment.push({
                from: sender.name,
                tag: sender.tag,
                amount: sendingmoney,
                transactiondate: await dateFormatter,
                time: await timeFormatter,
                note: note.value,
              });
              sender.completedPayment.push(payingTo);
            } else {
              receieve_user.pendingPayment = {
                from: sender.name,
                tag: sender.tag,
                amount: sendingmoney,
                transactiondate: await dateFormatter,
                time: await timeFormatter,
                toCash: true,
                note: note.value,
              };
              sender.pendingPayment = payingTo;
            }
            receieve_user.received = {
              from: sender.name,
              amount: sendingmoney,
            };
            receieve_user.balance += sendingmoney;
            sender.balance -= sendingmoney;

            const API_KEY =
              "$2a$10$AL1ZZvl9kra1EIG8aJHskO9NEcTS1H9WPZI3EPV4rxrWyaKRYmT6e";
            const API_URL =
              "https://api.jsonbin.io/v3/b/68e6fe61d0ea881f409a63ea";
            await fetch(`${API_URL}`, {
              method: "PUT",
              headers: {
                "X-MASTER-KEY": API_KEY,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(users),
            });
            hideLoader();
            document
              .querySelector(".confirmed-receipt")
              .classList.remove("hide-item");
            document.querySelector(".confirmed-receipt-message").innerHTML = `
            You sent $${sendingmoney.toLocaleString()} to ${payingTo.sName}.
            `;
          }
        } catch (err) {
          console.log(err);
        }
      });
    } catch (er) {
      console.log(er);
    }
  });
}

export { startSend };
