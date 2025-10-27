import { createImages, fetchImage } from "./modules/supabase.js";
const API_KEY = "$2a$10$AL1ZZvl9kra1EIG8aJHskO9NEcTS1H9WPZI3EPV4rxrWyaKRYmT6e";
const API_URL = "https://api.jsonbin.io/v3/b/68e6fe61d0ea881f409a63ea";
const nameInput = document.querySelector(".user-name");
const tagInput = document.querySelector(".user-tag");
const emailInput = document.querySelector(".hnwi-id");
const pinInput = document.querySelector(".user-pin");
const isMaster = document.querySelector("#is-master");
let closePayroll = document.querySelector("#close-payroll");
const payroll = document.querySelector(".add-to-payroll");
const payrollImage = document.querySelector("#payroll-image");

closePayroll.addEventListener("click", () => {
  document.location = "index.html";
});
let selected = null;
document
  .querySelector("#recieve-image")
  .addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    selected = file;
    const imageUrl = URL.createObjectURL(file);
    payrollImage.src = imageUrl;
  });

document
  .querySelector("#add-to-payroll")
  .addEventListener("click", async () => {
    if (!nameInput.value || !tagInput.value || !emailInput.value) {
      alert("Please fill all fields");
      return;
    }

    const res = await fetch(`${API_URL}/latest`, {
      headers: { "X-MASTER-KEY": API_KEY },
    });
    const data = await res.json();
    const users = data.record;

    if (
      users.some(
        (u) =>
          u.tag.toLowerCase() === tagInput.value.toLowerCase() ||
          u.hnwi_id === emailInput.value.trim()
      )
    ) {
      alert("User already exists");
      return;
    }

    if (!selected) return window.alert("you must selected an image");
    const base = await createImages(tagInput.value.trim(), selected);
    window.alert(base);
    const newUser = {
      name: nameInput.value.trim(),
      tag: tagInput.value.trim(),
      hnwi_id: emailInput.value.trim(),
      pendingPayment: {},
      balance: 0,
      received: [],
      completedPayment: [],
      locked: { status: "open" },
      pin: pinInput.value,
      master: false,
    };
    if (isMaster.checked) {
      console.log(isMaster.value);
      newUser.master = true;
    }

    users.push(newUser);

    await fetch(`${API_URL}`, {
      method: "PUT",
      headers: {
        "X-MASTER-KEY": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(users),
    });

    alert("User added successfully!");
  });
