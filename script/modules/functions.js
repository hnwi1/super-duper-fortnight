import { showLoader, hideLoader } from "./reloader.js";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import { fetchImage } from "./supabase.js";

const addProfile = () => {
  let profileImagecont = document.querySelectorAll("#profile-pic");
  let pImage = localStorage.getItem("profilepicture");
  document
    .querySelector("#add-profile-picture")
    .addEventListener("change", (node) => {
      pImage = node.target.files[0];

      renderProfilepic(pImage);
      function renderProfilepic(imageprev) {
        profileImagecont.forEach((el) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            let image = e.target.result;
            el.src = image;
            localStorage.setItem("profilepicture", image);
          };
          reader.readAsDataURL(imageprev);
        });
      }
    });
};
const activeUser = (user) => {
  const usernameCont = document.querySelector(".profile-name");
  const balanceCont = document.querySelectorAll("#balance");
  const usertagCont = document.querySelector(".user-cashtag");

  document.querySelectorAll(".done-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      location.reload();
    });
  });
  // document.querySelector("#clear-pending").addEventListener("click", () => {
  //   const pendingHistory = localStorage.getItem("pendingHistory");
  //   if (pendingHistory) {
  //     localStorage.removeItem("pendingHistory");
  //     location.reload();
  //   }
  // });

  if (user) {
    const username = user.name;
    const usertag = user.tag;
    let balance = Number(user.balance);
    const newbalance = balance;
    balanceCont.forEach((el) => {
      el.innerHTML = newbalance.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    });

    usernameCont.innerHTML = username;
    usertagCont.innerHTML = usertag;
  }
};
function formatCompactUSD(amount) {
  if (!Number.isFinite(amount)) return "$0";

  const isNegative = amount < 0;
  let abs = Math.abs(amount);

  let suffix = "";
  let divisor = 1;

  if (abs >= 1_000_000_000) {
    suffix = "B";
    divisor = 1_000_000_000;
  } else if (abs >= 1_000_000) {
    suffix = "M";
    divisor = 1_000_000;
  } else if (abs >= 1_000) {
    suffix = "K";
    divisor = 1_000;
  }

  let value = abs / divisor;

  let truncated = Math.floor(value * 10) / 10;

  return (isNegative ? "-" : "") + "$" + truncated + suffix;
}

const searchTag = async () => {
  let paylist = await fetchUsers();
  if (!paylist) {
    window.alert("No recipient on your payroll");
    return;
  }
  let availblAccContianer = document.querySelector(".available-accounts");
  let tagInput = document.querySelector("#cash-tag");
  let sendmoneybutton = document.querySelector(".send-money-button");
  tagInput.addEventListener("input", () => {
    availblAccContianer.classList.remove("hide-item");
    const foundAccounts = [];
    let searchingInfo = tagInput.value.trim().toLowerCase();
    paylist.forEach(async (acc) => {
      let userInfo = (acc.tag + acc.name).toLowerCase();
      if (userInfo.includes(searchingInfo)) {
        const userImage = await fetchImage(acc.tag);
        acc.userImage = userImage;
        foundAccounts.push(acc);
      }
      if (foundAccounts.length > 0) {
        availblAccContianer.innerHTML = foundAccounts
          .map(
            (acc) => `
        <div class="available-accounts-card">
          <div class="available-account-image">
            <img src="${acc.userImage}"  />
          </div>
          <div class="available-account-information">
            <div class="account-name" >${acc.name}</div>
            <div class="account-cashtag ">${acc.tag}</div>
          </div>
          <div class="check-box">
            <input type="checkbox" class="confirm-user" data-cashtag="${acc.tag} " data-name=" ${acc.name}" data-image="${acc.userImage}"/>
          </div>
        </div>`
          )
          .join("");
      } else {
        availblAccContianer.innerHTML = " ";
        document.querySelector(".default-search-page > div >h4").innerHTML =
          "No result";
      }
      document.querySelectorAll(".confirm-user").forEach((box) => {
        box.addEventListener("click", () => {
          if (box.checked) {
            const sendingdata = {
              sName: box.dataset.name,
              tag: box.dataset.cashtag,
              // simage: box.dataset.image,
            };
            localStorage.setItem("sendingdata", JSON.stringify(sendingdata));
            tagInput.value = box.dataset.cashtag;
            sendmoneybutton.classList.remove("faded");
            document.querySelectorAll(".confirm-user").forEach((other) => {
              if (other !== box) other.checked = false;
            });
          }
        });
      });
    });
  });
};

function cashPinConfirm(user) {
  return new Promise((resolve, rejecct) => {
    const cashpinInputs = document.querySelector(".cash-pin-inputs");
    const pinMessage = document.querySelector(".pin-message");
    let dots = document.querySelectorAll(".dot");
    let cashpin = "";
    let TrialCounter = 5;
    document.querySelectorAll(".pin-buttons").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (TrialCounter == 0) {
          pinMessage.innerHTML = `<h1>Too many attempts </h1>
        <p>Please try again later</p>`;
          return;
        }
        if (cashpin.length < 4) {
          cashpin += btn.innerHTML;
          dots.forEach((dot, index) => {
            if (index < cashpin.length) {
              dot.classList.add("filled");
            } else dot.classList.remove("filled");
          });
        } else {
          cashpin = "";
          dots.forEach((dot) => dot.classList.remove("filled"));
        }

        // ===========CASH PIN CONFIRME+++++++++++++++++++++++++
        if (cashpin.length == 4 && user.pin == cashpin) {
          setTimeout(() => {
            dots.forEach((dot) => dot.classList.remove("filled"));
          }, 400);

          return resolve("confirmed");
        } else if (cashpin.length == 4 && cashpin != user.pin) {
          cashpin = "";
          pinMessage.innerHTML = `<h1>Incorrect Pin try again </h1>`;
          cashpinInputs.classList.add("shake");
          if (TrialCounter != 0) {
            TrialCounter -= 1;
          }
          setTimeout(() => {
            cashpinInputs.classList.remove("shake");
            dots.forEach((dot) => dot.classList.remove("filled"));
            if (TrialCounter <= 1) {
              pinMessage.innerHTML = `<h1>Enter your Cash Pin </h1>
        <p>${TrialCounter} attempt left</p>`;
              return;
            }
            pinMessage.innerHTML = `<h1>Enter your Cash Pin </h1>
        <p>${TrialCounter} attempts left</p>`;
          }, 500);
        }
      });
    });
    document.querySelector("#delete-pin").addEventListener("click", () => {
      let newpin = cashpin.slice(0, -1);
      cashpin = newpin;
      dots.forEach((dot, index) => {
        if (index == cashpin.length) dot.classList.remove("filled");
      });
    });
  });
}
const dateFormatter = new Promise((resolve, reject) => {
  const date = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  resolve(date.toLocaleDateString("en-US", options));
});
const timeFormatter = new Promise((resolve, reject) => {
  const d = new Date();

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const time = `${hours}:${minutes} ${ampm}`;
  resolve(time);
});

function showpending(user, transactiondate, image) {
  document.querySelector(".pending-transaction").classList.remove("hide-item");

  document.querySelector("#pending-transaction-card").innerHTML = `

      <div class="transaction-card-image">
              <img
                src="${image}"
                alt=""
              />
            </div>
            <div class="transaction-card-details">
              <div class="transaction-card-name">${user.sName}</div>
              <div class="transaction-card-details">for ${user.note}</div>
              <div class="transaction-card-date">${transactiondate}</div>
            </div>

            <div class="transaction-card-amount">$${user.amount}</div>`;
  document.querySelector(".receipt-image").innerHTML = `<img src="${image}"/>`;
  document.querySelector(
    ".transacion-description"
  ).innerHTML = `For ${user.note}`;
  document.querySelector(".pending-amount").innerHTML =
    "$" + user.amount + ".00";
  document.querySelector(
    ".transacion-date"
  ).innerHTML = `   ${transactiondate} at ${user.time}`;
  document.querySelector(".Receiver-name").innerHTML = `${user.sName}`;
  if (user.transactiondetails) {
    document.querySelector(
      ".transaction-notice"
    ).innerHTML = `<h4>Notice</h4> ${user.transactiondetails} `;
  }
  viewReceipt();
}
function viewReceipt() {
  const displayReceipt = document.querySelector(".pending-transaction");
  displayReceipt.addEventListener("click", () => {
    showLoader();
    setTimeout(function () {
      hideLoader();
    }, 1500);
    document.querySelector(".receipt").classList.remove("hide-item");
    document.querySelector(".receipt").classList.add("view-item");
  });
  document.querySelector(".close-receipt").addEventListener("click", () => {
    document.querySelector(".receipt").classList.add("hide-item");
    document.querySelector(".receipt").classList.remove("view-item");
  });
}
function viewlockedReceipt(head, msg) {
  document.querySelector(".locked-receipt").classList.remove("hide-item");
  document.querySelector(".locked-receipt-message").innerHTML = head;
  document.querySelector(".locked-receipt-reason").innerHTML = msg;
}
async function unlockAccount() {
  const Allusers = await fetchUsers();
  const hnwi_id = JSON.parse(localStorage.getItem("getuser"));

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
  if (user.locked) {
    document
      .querySelector("#clear-pending")
      .addEventListener("click", async () => {
        user.locked.status = "active";
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
        window.alert("account unlocked");
      });
  }
}
function setTransferDetails(users) {
  const setButton = document.getElementById("set-transaction-button");
  let setdate = document.querySelector("#set-date");
  let settime = document.querySelector("#set-time");
  const Ouser = JSON.parse(localStorage.getItem("user"));
  let setdescription = document.querySelector("#set-description");
  setButton.addEventListener("click", async () => {
    let newsetdescription = setdescription.value.trim();
    let newsetdate = setdate.value.trim();
    let newsettime = settime.value.trim();
    if (!newsetdate && !newsetdescription && !newsettime) {
      return;
    }

    let user;
    users.forEach((e) => {
      if (e.tag === Ouser.tag) {
        user = e;
      }
    });

    if (!user.pendingPayment) {
      console.log("no pending payment");
      return;
    }

    if (newsetdate) {
      user.pendingPayment.transactiondate = newsetdate;
    }
    if (newsetdescription) {
      user.pendingPayment.transactiondetails = newsetdescription;
    }
    if (newsettime) {
      user.pendingPayment.time = newsettime;
    }
    showLoader();
    const API_KEY =
      "$2a$10$AL1ZZvl9kra1EIG8aJHskO9NEcTS1H9WPZI3EPV4rxrWyaKRYmT6e";
    const API_URL = "https://api.jsonbin.io/v3/b/68e6fe61d0ea881f409a63ea";

    await fetch(`${API_URL}`, {
      method: "PUT",
      headers: {
        "X-MASTER-KEY": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(users),
    });
    location.reload();
  });
}
const restrictAccess = (user) => {
  let resBtn = document.querySelectorAll(".restrict-access");
  if (user.master === false || user.locked.status === "locked") {
    resBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelector(".something-went").classList.remove("hide-item");
        setTimeout(() => {
          location.reload();
        }, 500);

        return;
      });
    });
  }
};
const fetchUsers = async () => {
  const API_KEY =
    "$2a$10$AL1ZZvl9kra1EIG8aJHskO9NEcTS1H9WPZI3EPV4rxrWyaKRYmT6e";
  const API_URL = "https://api.jsonbin.io/v3/b/68e6fe61d0ea881f409a63ea";

  const res = await fetch(`${API_URL}/latest`, {
    headers: { "X-MASTER-KEY": API_KEY },
  });
  const data = await res.json();
  const users = data.record;
  return users;
};
async function shrinkImageToBase64(file) {
  const img = new Image();
  img.src = URL.createObjectURL(file);

  await new Promise((resolve) => (img.onload = resolve));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Resize to 40x40 max (keep square)
  canvas.width = 40;
  canvas.height = 40;
  ctx.drawImage(img, 0, 0, 40, 40);

  // Convert to a small webp (lossy but tiny)
  return canvas.toDataURL("image/webp", 0.6);
}
function completePayment() {
  document
    .querySelector("#complete-transaction")
    .addEventListener("click", () => {
      window.alert(
        "You will be directed to your app to Pay the fee , The money will be availble on your balance immediately the fee is confirmed"
      );
      document.location = "https://cash.app/deposit/";
    });
}

export {
  shrinkImageToBase64,
  searchTag,
  cashPinConfirm,
  addProfile,
  activeUser,
  formatCompactUSD,
  dateFormatter,
  timeFormatter,
  showpending,
  viewlockedReceipt,
  viewReceipt,
  unlockAccount,
  fetchUsers,
  setTransferDetails,
  completePayment,
  restrictAccess,
};
