import { fetchImage } from "./supabase.js";
import { showpending } from "./functions.js";
import { viewReceipt } from "./functions.js";
import { completePayment } from "./functions.js";
async function loadPending(user) {
  if (user.master === true && user.pendingPayment) {
    try {
      console.log(user.pendingPayment);
      const transactiondate = user.pendingPayment.transactiondate;
      const tag = user.pendingPayment.tag.trim();
      console.log(tag);
      const image = await fetchImage(tag);
      console.log(image);
      showpending(user.pendingPayment, transactiondate, image);
    } catch (e) {
      console.log(e);
    }
  } else if (user.master === false && user.pendingPayment) {
    console.log(user.pendingPayment);
    const tag = user.pendingPayment.tag.trim();
    console.log(tag);
    const image = await fetchImage(tag);
    viewReceipt();
    document.querySelector("#pending-transaction-card").innerHTML = `

      <div class="transaction-card-image">
              <img
                src="${image}"
                alt=""
              />
            </div>
            <div class="transaction-card-details">
              <div class="transaction-card-name">${
                user.pendingPayment.from
              }</div>
              <div class="transaction-card-details"> for ${
                user.pendingPayment.note
              }</div>
              <div class="transaction-card-date"></div>
            </div>

            <div class="transaction-card-amount">$${user.pendingPayment.amount.toLocaleString()}</div>`;
    document
      .querySelector(".pending-transaction")
      .classList.remove("hide-item");

    document.querySelector(".receipt-screen").innerHTML = `  
        <div class="newPending-top">
          <div class="newPending-image">
            <img src="${image}" alt="" />
          </div>
          <div>
            <p class="new-name">${user.pendingPayment.from}</p>
            <p>for ${user.pendingPayment.note}</p>
             <p style="font-size:10px;">${
               user.pendingPayment.transactiondate
             } at ${user.pendingPayment.time}</p>
          </div>
        </div>

        <div class="newPending-amount">
          <p>$${user.pendingPayment.amount.toLocaleString()}</p>
        </div>
        <div class="newPending-bottom">
          <div class="newPending-note">
            This transaction has been claimed to your account , pay the
            specified fee to complete payment
          </div>
          <button id="complete-transaction">Accept</button>
        </div>`;
    completePayment();
  }
}
async function loadCompleted(comp, image) {
  const cont = document.querySelector(".recent-transactions");
  cont.classList.remove("hide-item");
  cont.classList.add("view-item");
  cont.innerHTML += `   <div class="transaction-card">
            <div class="transaction-card-image">
              <img
                src="${image}"
                alt=""
              />
            </div>
            <div class="transaction-card-details">
              <div class="transaction-card-name">${
                comp.sName || comp.from
              }</div>
              <div class="transaction-card-details">${comp.amount.toLocaleString()} for ${
    comp.note
  }</div>
              <div class="transaction-card-date">${comp.transactiondate}</div>
            </div>
            <div class="transaction-card-amount">$${comp.amount.toLocaleString()}</div>
          </div>`;
}
export { loadPending, loadCompleted };
