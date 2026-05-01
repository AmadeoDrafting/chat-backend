import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// memoria simple (por ahora)
let userData = {};

app.post("/chat", async (req, res) => {

  const message = req.body.message.toLowerCase();

  // Paso 1: tipo de proyecto
  if (!userData.type) {

    if (message.includes("shop") || message.includes("drawing")) {
      userData.type = "shop_drawings";
    } else if (message.includes("solidworks")) {
      userData.type = "solidworks";
    } else if (message.includes("steel")) {
      userData.type = "steel";
    }

    return res.json({
      reply: "Great. What is the approximate size or scope of the project?"
    });
  }

  // Paso 2: tamaño
  if (!userData.size) {
    userData.size = message;
    return res.json({
      reply: "Would you say the project is simple or complex?"
    });
  }

  // Paso 3: complejidad
  if (!userData.complexity) {
    if (message.includes("complex")) {
      userData.complexity = "complex";
    } else {
      userData.complexity = "simple";
    }

    // 💰 CALCULAR PRECIO
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
app.listen(3000, () => console.log("Server running"));
