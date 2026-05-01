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

    if (["shop", "shop drawings"].includes(message)) {
      userData.service = "shop";
    } 
    else if (["solidworks"].includes(message)) {
      userData.service = "solidworks";
    } 
    else if (["steel"].includes(message)) {
      userData.service = "steel";
    } 
    else {
      return res.json({
        reply: "Please select a service:",
        options: ["Shop Drawings", "SolidWorks", "Steel Structure", "Other"]
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
    if (userData.service === "solidworks") hours = 5;
    if (userData.service === "steel") hours = 8;

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
