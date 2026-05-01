import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let userData = {};

app.post("/chat", (req, res) => {

  const message = (req.body.message || "").toLowerCase().trim();

  // =========================
  // PASO 1: SERVICIO
  // =========================
if (!userData.service) {

  if (message.includes("shop")) {
    userData.service = "shop";
  } 
  else if (message.includes("3d") || message.includes("model")) {
    userData.service = "3d_modeling";
  } 
  else if (message.includes("steel")) {
    userData.service = "steel";
  } 
  else if (message.includes("architecture")) {
    userData.service = "architecture";
  } 
  else {
    return res.json({
      reply: "Please select a service:",
      options: [
        "Shop Drawings",
        "3D Modeling (SolidWorks)",
        "Structural Steel Detailing",
        "Architectural Drafting",
        "Custom Project"
      ]
    });
  }

  return res.json({
    reply: "Select project size:",
    options: ["Small", "Medium", "Large"]
  });
}

  // =========================
  // PASO 2: TAMAÑO
  // =========================
  if (!userData.size) {
    userData.size = message;

    return res.json({
      reply: "Select complexity:",
      options: ["Simple", "Medium", "Complex"]
    });
  }

  // =========================
  // PASO 3: COMPLEJIDAD
  // =========================
  if (!userData.complexity) {
    userData.complexity = message;

    return res.json({
      reply: "Select deadline:",
      options: ["Standard", "Urgent"]
    });
  }

  // =========================
  // PASO 4: DEADLINE
  // =========================
  if (!userData.deadline) {
    userData.deadline = message;

    // ⏱️ ESTIMAR HORAS
    let hours = 0;

    // base por servicio
    if (userData.service === "shop") hours = 6;
    if (userData.service === "3d_modeling") hours = 5;
    if (userData.service === "steel") hours = 8;
    if (userData.service === "architecture") hours = 7;

    // tamaño
    if (userData.size === "medium") hours += 4;
    if (userData.size === "large") hours += 8;

    // complejidad
    if (userData.complexity === "complex") hours += 6;
    if (userData.complexity === "medium") hours += 3;

    // urgencia
    if (userData.deadline === "urgent") hours *= 1.2;

    const price = Math.round(hours * 50);

    userData = {};

    return res.json({
      reply: `Estimated time: ${Math.round(hours)} hours.\nEstimated cost: $${price} CAD.\n\nWould you like a formal quote?`,
      options: ["Yes, send quote", "Modify project", "Other"]
    });
  }

});

app.listen(3000, () => console.log("Server running"));
