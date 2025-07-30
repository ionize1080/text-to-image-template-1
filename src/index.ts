export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (url.pathname === "/image" && request.method === "GET") {
      const prompt = url.searchParams.get("prompt") || "cyberpunk cat";
      const inputs = { prompt };
      const image = await env.AI.run(
        "@cf/stabilityai/stable-diffusion-xl-base-1.0",
        inputs,
      );
      return new Response(image, {
        headers: { "content-type": "image/png" },
      });
    }

    if (url.pathname === "/") {
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Text to Image</title>
<style>
  body {
    font-family: Arial, sans-serif;
    background: #f5f7fa;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
  }
  .container {
    text-align: center;
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    width: 320px;
  }
  input[type="text"] {
    width: 100%;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  button {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    background: #0070f3;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  button:hover {
    background: #0059c1;
  }
  button[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .status {
    display: none;
    margin-top: 1rem;
    color: #555;
    font-size: 0.9rem;
    font-style: italic;
    align-items: center;
    justify-content: center;
  }
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #eee;
    border-top: 2px solid #0070f3;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  img {
    margin-top: 1rem;
    max-width: 100%;
    border-radius: 8px;
  }
</style>
</head>
<body>
<div class="container">
  <h1>Generate an Image</h1>
  <form id="prompt-form">
    <input id="prompt-input" type="text" placeholder="Describe the image" required />
    <button type="submit">Generate</button>
    <p id="status" class="status"><span class="spinner"></span>Generating image...</p>
  </form>
  <img id="result" alt="Your generated image will appear here" />
</div>
<script>
  const form = document.getElementById('prompt-form');
  const input = document.getElementById('prompt-input');
  const img = document.getElementById('result');
  const button = form.querySelector('button');
  const status = document.getElementById('status');
  const defaultStatus = status.innerHTML;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    button.disabled = true;
    status.innerHTML = defaultStatus;
    status.style.display = 'flex';
    img.src = '/image?prompt=' + encodeURIComponent(input.value);
  });
  img.addEventListener('load', () => {
    button.disabled = false;
    status.style.display = 'none';
  });
  img.addEventListener('error', () => {
    button.disabled = false;
    status.style.display = 'block';
    status.innerHTML = 'Failed to generate image';
  });
</script>
</body>
</html>`;

      return new Response(html, {
        headers: { "content-type": "text/html;charset=UTF-8" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
