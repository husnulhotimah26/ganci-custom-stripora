// --- FUNGSI UPLOAD CLOUDINARY ---
async function uploadToCloudinary(file) {
  const url = "https://api.cloudinary.com/v1_1/dljfdauc5/image/upload";
  const preset = "unsigned"; // GANTI: harus preset kamu

  let formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  const response = await fetch(url, {
    method: "POST",
    body: formData
  });

  const data = await response.json();
  return data.secure_url;
}

// --- FIREBASE (VERSION 9 MODULAR) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDsnkZTIC_Aetylv5paMCw8oIGaK_p3bSE",
  authDomain: "stripora-9d124.firebaseapp.com",
  projectId: "stripora-9d124",
  storageBucket: "stripora-9d124.firebasestorage.app",
  messagingSenderId: "759824343244",
  appId: "1:759824343244:web:2b505d5d7af81639b7a269",
  measurementId: "G-JBG0XRLR70"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- SUBMIT FORM ---
document.getElementById("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const status = document.getElementById("status");
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  status.textContent = "Mengirim pesanan...";

  const file = document.getElementById("design").files[0];
  let imageURL = null;

  try {
    if (file) {
      status.textContent = "Mengupload gambar...";
      imageURL = await uploadToCloudinary(file);
    }

    const data = {
      name: document.getElementById("name").value,
      whatsapp: document.getElementById("whatsapp").value,
      material: document.getElementById("material").value,
      qty: Number(document.getElementById("qty").value),
      note: document.getElementById("note").value,
      image: imageURL || "Tidak ada gambar",
      time: new Date().toISOString()
    };

    status.textContent = "Menyimpan ke database...";

    await addDoc(collection(db, "orders"), data);

    status.textContent = "Pesanan berhasil dikirim!";
    status.style.color = "green";

    document.getElementById("orderForm").reset();

  } catch (error) {
    console.error(error);
    status.textContent = "Terjadi kesalahan. Coba lagi.";
    status.style.color = "red";
  }

  submitBtn.disabled = false;
});
