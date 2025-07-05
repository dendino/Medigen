export async function sendCourseToN8N(formData: any) {
  const webhookUrl = "http://localhost:5678/webhook-test/generate-content";
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  if (!response.ok) throw new Error("Erreur lors de l’envoi au backend");
  return response.json();
}