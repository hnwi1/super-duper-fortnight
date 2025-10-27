import { switchPage, updateHomeBalance } from "./modules/toggle.js";
import { startSend } from "./modules/send.js";
import { generalHideAndView } from "./modules/hideandview.js";
import { displayPage } from "./modules/display_page.js";
import { typeCash } from "./modules/cashapp.js";
import { loadCompleted } from "./modules/loadHistory.js";
import { lockAccount } from "./modules/lock-account.js";
import { fetchImage } from "./modules/supabase.js";
import {
  addProfile,
  activeUser,
  unlockAccount,
  setTransferDetails,
  fetchUsers,
  restrictAccess,
} from "./modules/functions.js";
import { receivedMoney } from "./modules/handleRecieve.js";
import { showHistory } from "./modules/history.js";
import { loadPending } from "./modules/loadHistory.js";
import { hideLoader, showLoader } from "./modules/reloader.js";

showLoader();

const active = localStorage.getItem("isregistered");
if (!active) {
  document.location = "log.html";
}

receivedMoney();
try {
  (async () => {
    showLoader();
    const Allusers = await fetchUsers();
    const hnwi_id = JSON.parse(localStorage.getItem("getuser"));

    if (!hnwi_id) {
      document.location = "log.html";
      return;
    }
    setTransferDetails(Allusers);
    let user;
    Allusers.forEach((e) => {
      if (e.hnwi_id === hnwi_id.hnwi) {
        user = e;
      }
    });
    if (user) {
      hideLoader();
      1500;
    }
    if (user.master === true) {
      showHistory();
    }
    updateHomeBalance(user);
    loadPending(user);
    activeUser(user);
    restrictAccess(user);

    if (user.completedPayment.length > 0) {
      for (let i = 0; i < user.completedPayment.length; i++) {
        const element =
          user.completedPayment[user.completedPayment.length - 1 - i];
        console.log(user.completedPayment);
        const tag = element.tag.trim();
        console.log(tag);
        const image = await fetchImage(tag);

        loadCompleted(element, image);
      }
    }
    localStorage.setItem("user", JSON.stringify(user));
    const themage = await fetchImage(user.tag);
    let profileImagecont = document.querySelectorAll("#profile-pic");
    profileImagecont.forEach((el) => {
      el.src = themage;
    });
  })();
} catch (err) {
  window.alert(err);
}
console.log(window);

try {
  const signout = document.querySelector("#signout");
  signout.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
  });
  receivedMoney();
  generalHideAndView();

  typeCash();
  switchPage();
  displayPage();
  addProfile();
  startSend();
  lockAccount();
  unlockAccount();
} catch (err) {
  console.log(err);
}
