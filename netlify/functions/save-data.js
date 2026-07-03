const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_USER = 'publicidadyredes2026';
  const GITHUB_REPO = 'the-oruro-inn';

  try {
    const body = JSON.parse(event.body);
    const { password, data } = body;

    if (password !== ADMIN_PASSWORD) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Contraseña incorrecta' }) };
    }

    if (!GITHUB_TOKEN) {
      return { statusCode: 500, body: JSON.stringify({ error: 'GitHub token no configurado' }) };
    }

    // Obtener el SHA actual del archivo data.json en GitHub
    const getFileUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/data.json`;
    const getResult = await fetch(getFileUrl, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'netlify-function'
      }
    });

    const fileInfo = await getResult.json();
    const sha = fileInfo.sha;

    // Hacer commit con los nuevos datos
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    const commitResult = await fetch(getFileUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'netlify-function',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Actualización de datos desde panel admin',
        content: content,
        sha: sha,
        committer: {
          name: 'Admin Panel',
          email: 'admin@theoruroinn.netlify.app'
        }
      })
    });

    const commitResultJson = await commitResult.json();

    if (commitResult.status >= 200 && commitResult.status < 300) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'Datos guardados correctamente. El sitio se actualizará en 1-2 minutos.'
        })
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Error al guardar: ' + (commitResultJson.message || 'Error desconocido')
        })
      };
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error interno: ' + e.message })
    };
  }
};
