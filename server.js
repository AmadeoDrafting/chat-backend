import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let userData = {};

app.post("/chat", (req, res) => {

  const message = (req.body.message || "").toLowerCase().trim();

  // =========================
  // ACCIONES DESPUÉS DE COTIZACIÓN
  // =========================
  if (userData.finished) {

    if (message.includes("quote") || message.includes("yes")) {
      userData = {};
      return res.json({
        reply: "Perfect. Please provide your email and attach any files. We will send you a formal quote shortly."
      });
    }

    if (message.includes("modify") || message.includes("adjust")) {
      userData = {};
      return res.json({
        reply: "No problem. Let's start again. Please select a service:",
        options: [
          "Shop Drawings",
          "3D Modeling (SolidWorks)",
          "Structural Steel Detailing",
          "Architectural Drafting",
          "Custom Project"
        ]
      });
    }
  }

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
    else if (message.includes("custom")) {
      // 🔥 NO cotiza → pasa a modo manual
      userData = {};
      return res.json({
        reply: "Please describe your project and include your email. You can also attach files. We will review it and send you a custom quote."
      });
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

    if (message.includes("small")) userData.size = "small";
    else if (message.includes("medium")) userData.size = "medium";
    else if (message.includes("large")) userData.size = "large";

    return res.json({
      reply: "Select complexity:",
      options: ["Simple", "Medium", "Complex"]
    });
  }

  // =========================
  // PASO 3: COMPLEJIDAD
  // =========================
  if (!userData.complexity) {

    if (message.includes("simple")) userData.complexity = "simple";
    else if (message.includes("medium")) userData.complexity = "medium";
    else if (message.includes("complex")) userData.complexity = "complex";

    return res.json({
      reply: "Select deadline:",
      options: ["Standard", "Urgent"]
    });
  }

  // =========================
  // PASO 4: DEADLINE
  // =========================
  if (!userData.deadline) {

    if (message.includes("urgent")) userData.deadline = "urgent";
    else userData.deadline = "standard";

    // ⏱️ ESTIMACIÓN DE HORAS
    let hours = 0;

    if (userData.service === "shop") hours = 6;
    if (userData.service === "3d_modeling") hours = 5;
    if (userData.service === "steel") hours = 8;
    if (userData.service === "architecture") hours = 7;

    if (userData.size === "medium") hours += 4;
    if (userData.size === "large") hours += 8;

    if (userData.complexity === "medium") hours += 3;
    if (userData.complexity === "complex") hours += 6;

    if (userData.deadline === "urgent") hours *= 1.2;

    const price = Math.round(hours * 50);

    // marcar como terminado
    userData.finished = true;

    return res.json({
      reply: `Estimated time: ${Math.round(hours)} hours.\nEstimated cost: $${price} CAD.\n\nWould you like to request a formal quote?`,
      options: [
        "Request Formal Quote",
        "Adjust Project",
        "Custom Project"
      ]
    });
  }

});

app.listen(3000, () => console.log("Server running"));
