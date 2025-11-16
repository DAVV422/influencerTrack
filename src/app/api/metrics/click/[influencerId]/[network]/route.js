import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(),"src" ,"data", "influencers.json");

export async function POST(req, { params }) {
  const { influencerId, network } = params;

  // Leer JSON existente
  let influencers = [];
  try {
    const json = fs.readFileSync(filePath, "utf-8");
    influencers = JSON.parse(json);
  } catch (err) {
    console.error("Error leyendo JSON:", err);
    return new Response(JSON.stringify({ error: "No se pudo leer JSON" }), { status: 500 });
  }

  // Buscar influencer por nombre (puedes usar `name` o `id`)
  const influencer = influencers.find((inf) => inf.id === influencerId);
  console.log(influencer)
  if (!influencer) {
    return new Response(JSON.stringify({ error: "Influencer no encontrado" }), { status: 404 });
  }

  // Inicializar clic_descargas si no existe
  if (!influencer.clic_descargas) influencer.clic_descargas = {};

  // Incrementar el contador por social
  if (!influencer.clic_descargas[network]) influencer.clic_descargas[network] = 0;
  influencer.clic_descargas[network] += 1;

  // Guardar cambios en el JSON
  try {
    fs.writeFileSync(filePath, JSON.stringify(influencers, null, 2));
  } catch (err) {
    console.error("Error escribiendo JSON:", err);
    return new Response(JSON.stringify({ error: "No se pudo actualizar JSON" }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, influencer }), { status: 200 });
}
