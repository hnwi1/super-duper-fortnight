import { showLoader } from "./reloader.js";
import { hideandview } from "./toggle.js";

let hideProfile = document.querySelector("#close-profile");
let viewProfile = document.querySelector("#view-profile");
let viewpayroll = document.querySelectorAll("#to-payroll");
const user = JSON.parse(localStorage.getItem("user"));
const buttons = document.querySelectorAll(".explore-card");
let something = document.querySelector(".something-went");
function displayPage() {
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      something.classList.remove("hide-item");
    });
  });
  document.querySelector(".hide-something").addEventListener("click", () => {
    something.classList.add("hide-item");
  });
  document.querySelector("#search-btn").addEventListener("click", () => {
    something.classList.remove("hide-item");
  });
  document.querySelectorAll(".more-ways-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      something.classList.remove("hide-item");
    });
  });
  document.querySelectorAll(".setting-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      something.classList.remove("hide-item");
    });
  });
  document.querySelectorAll(".balance-buttons button").forEach((btn) => {
    btn.addEventListener("click", () => {
      something.classList.remove("hide-item");
    });
  });
  const profile = document.querySelector(".profile");
  hideandview(viewProfile, true, profile, false, 0);
  hideandview(hideProfile, false, profile, 0);
  document.querySelector("#go-to-edit").addEventListener("click", () => {
    console.log(user);
    if (user.master === false || user.locked.status === "locked") {
      something.classList.remove("hide-item");
      return;
    }

    document.location = "project5815.html";
  });
  viewpayroll.forEach((el) => {
    el.addEventListener("click", () => {
      showLoader();
      if (user.master === false || user.locked.status === "locked") {
        something.classList.remove("hide-item");
        return;
      }

      document.location = "create.html";
    });
  });
}
export { displayPage };
