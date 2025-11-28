// =============================
// CLOUDINARY UPLOAD FUNCTION
// =============================
async function uploadToCloudinary(file) {
  const url = "https://api.cloudinary.com/v1_1/dljfdauc5/image/upload";
  const preset = "unsigned"; // GANTI JIKA PRESET MU BERBEDA

  let formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  const response = await fetch(url, {
    method: "POST",
    body: formData
  });

  const data = await response.json();

  if (!data.secure_url) {
    throw new Error("Gagal upload ke Cloudinary");
  }

  return data.secure_url;
}



// =============================
// FIREBASE SETUP (VERSI 8)
// =============================
const firebaseConfig = {
  apiKey: "AIzaSyDsnkZTIC_Aetylv5paMCw8oIGaK_p3bSE",
  authDomain: "stripora-9d124.firebaseapp.com",
  projectId: "stripora-9d124",
  storageBucket: "stripora-9d124.firebasestorage.app",
  messagingSenderId: "759824343244",
  appId: "1:759824343244:web:2b505d5d7af81639b7a269",
  measurementId: "G-JBG0XRLR70"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();



// =============================
// FORM SUBMIT
// =============================
document.getElementById("orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const status = document.getElementById("status");
  const submitBtn = document.getElementById("submitBtn");

  submitBtn.disabled = true;
  status.style.color = "black";
  status.textContent = "Mengirim pesanan...";

  const fileInput = document.getElementById("design").files[0];
  let imageURL = "Tidak ada gambar";

  try {
    // Upload gambar jika ada
    if (fileInput) {
      status.textContent = "Mengupload gambar ke Cloudinary...";
      imageURL = await uploadToCloudinary(fileInput);
    }

    // Data formulir
    const data = {
      name: document.getElementById("name").value,
      whatsapp: document.getElementById("whatsapp").value,
      material: document.getElementById("material").value,
      qty: parseInt(document.getElementById("qty").value),
      note: document.getElementById("note").value,
      image: imageURL,
      time: new Date().toISOString()
    };

    status.textContent = "Menyimpan ke database...";

    // SIMPAN ke Firestore
    await db.collection("orders").add(data);

    status.textContent = "Pesanan berhasil dikirim! Admin akan menghubungi via WhatsApp.";
    status.style.color = "green";

    document.getElementById("orderForm").reset();

  } catch (err) {
    console.error(err);
    status.textContent = "Terjadi kesalahan. Coba lagi.";
    status.style.color = "red";
  }

  submitBtn.disabled = false;
});
