app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],

        // Permitir scripts inline e APIs externas
        scriptSrc: ["'self'", "'unsafe-inline'", "https://apis.google.com"],

        // Permitir estilos inline e Google Fonts
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],

        // Permitir fontes do Google
        fontSrc: ["'self'", "https://fonts.gstatic.com"],

        // Permitir imagens de fontes externas
        imgSrc: [
          "'self'",
          "data:", // Permite imagens embutidas (base64)
          "https://i.imgur.com",
          "https://img.icons8.com"
        ],

        // Permitir conexões externas (API do BunnyStream e outras)
        connectSrc: [
          "'self'",
          "https://srv-marvelflix.onrender.com",
          "https://video.bunnycdn.com"
        ],

        // Permitir iframes do BunnyStream
        frameSrc: ["'self'", "https://iframe.mediadelivery.net"],

        // Permitir carregamento de arquivos de mídia (vídeos, áudios)
        mediaSrc: ["'self'", "https://iframe.mediadelivery.net"],

        // Permitir carregamento de estilos externos específicos
        styleSrcElem: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],

        // Permitir embeds e frames de fontes confiáveis
        frameAncestors: ["'self'", "https://iframe.mediadelivery.net"]
      },
    },
  })
);
