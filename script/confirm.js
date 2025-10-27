import { cashPinConfirm } from "./modules/functions.js";
console.log("hello");
const user = localStorage.getItem("getuser");
if (!user) {
  document.location = "log.html";
}

document.querySelector(".cash-pin").classList.remove("hide-item");
(async () => {
  const user = JSON.parse(localStorage.getItem("getuser"));
  const confirmed = await cashPinConfirm(user);
  if (confirmed === "confirmed") {
    localStorage.setItem("isregistered", "true");
    document.location = "index.html";
  }
})();
