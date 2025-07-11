export async function sendCourseToN8N(formData: any) {
  const webhookUrl = "http://localhost:5678/webhook-test/generate-support"; // Assurez-vous que l'URL est correcte
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${formData.token}` // Inclure le JWT dans les en-têtes
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) throw new Error("Erreur lors de l’envoi au backend");
  return response.json();
}