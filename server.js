import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// memoria simple (1 usuario por ahora)
let userData = {};

app.post("/chat", async (req, res) => {

  // seguridad básica
  if (!req.body.message) {
    return res.json({
      reply: "Please select an option or type your message."
    });
  }

  const message = (req.body.message || "").toLowerCase().trim();

  // =========================
  // PASO 1: TIPO DE PROYECTO
  // =========================
  if (!userData.type) {

    if (message.includes("shop") || message.includes("drawing")) {
      userData.type = "shop_drawings";
    } 
    else if (message.includes("solidworks")) {
      userData.type = "solidworks";
    } 
    else if (message.includes("steel")) {
      userData.type = "steel";
    } 
    else {
      return res.json({
        reply: "Please choose one option: Shop drawings, SolidWorks, or Steel structure. You can also click 'Other'."
      });
    }

    return res.json({
      reply: "Great. What is the approximate size or scope of the project?"
    });
  }

  // =========================
  // PASO 2: TAMAÑO
  // =========================
  if (!userData.size) {
    userData.size = message;

    return res.json({
      reply: "Would you say the project is simple or complex?"
    });
  }

  // =========================
  // PASO 3: COMPLEJIDAD
  // =========================
  if (!userData.complexity) {

    if (message.includes("complex")) {
      userData.complexity = "complex";
    } else {
      userData.complexity = "simple";
    }

    // =========================
    // 💰 CÁLCULO DE PRECIO
    // =========================
    let price = 0;

    if (userData.type === "shop_drawings") price += 150;
    if (userData.type === "solidworks") price += 200;
    if (userData.type === "steel") price += 300;

    if (userData.complexity === "complex") price += 150;

    const finalPrice = price;

    // reset para siguiente cliente
    userData = {};

    return res.json({
      reply: `Based on your project, the estimated price is $${finalPrice} CAD. Would you like to proceed or receive a formal quote?`
    });
  }

});

// servidor
app.listen(3000, () => console.log("Server running"));
