import { create } from 'zustand';
import { TextureLoader } from 'three';
import { useGLTF } from '@react-three/drei';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { Howl } from 'howler';

const assets = {
  models: [
    // fazenda
    '/models/fazenda/Solo.glb',
    '/models/fazenda/Casa.glb',
    '/models/fazenda/Cercas.glb',
    '/models/fazenda/Galpao.glb',
    '/models/fazenda/Ornamentos.glb',

    // geral
    '/models/geral/Mesas.glb',
    '/models/geral/Placeholder.glb',

    // intro
    '/models/intro/Logo.glb',

    // neons
    '/models/neons/NeonCasa.glb',
    '/models/neons/NeonAntena.glb',
    '/models/neons/NeonTrator.glb',
    '/models/neons/NeonVaca.glb',
    '/models/neons/NeonEstacaoMeteorologica.glb',

    // products
    //  AgroCobertura
    '/models/products/AgroCobertura/Antena.glb',
    '/models/products/AgroCobertura/AntenaMiniatura.glb',
    //  ClimaInteligente
    '/models/products/ClimaInteligente/EstacaoMeteorologica.glb',
    '/models/products/ClimaInteligente/EstacaoMeteorologicaMiniatura.glb',
    //  GestaoMaquinario
    '/models/products/GestaoMaquinario/DispositivoGestaoDeMaquinario-Miniatura.glb',
    '/models/products/GestaoMaquinario/DispositivoGestaoDeMaquinario.glb',
    '/models/products/GestaoMaquinario/Trator.glb',
    //  GestaoPecuaria
    '/models/products/GestaoPecuaria/Brinco.glb',
    '/models/products/GestaoPecuaria/BrincoMiniatura.glb',
    '/models/products/GestaoPecuaria/DispositivosPecuaria.glb',
    '/models/products/GestaoPecuaria/VacaHolandesa.glb',
    '/models/products/GestaoPecuaria/VacaNelore.glb',

    // tablets
    '/models/neons/TabletAgro.glb',
    '/models/neons/TabletClima.glb',
    '/models/neons/TabletMaquinario.glb',
    '/models/neons/TabletPecuaria.glb',

    // vegetaçao
    '/models/vegetacao/ArvoresDistantes.glb',
    '/models/vegetacao/Grama.glb',
    '/models/vegetacao/Soja.glb',
    '/models/vegetacao/SojaFundo.glb',
    '/models/vegetacao/VegetacaoPerto.glb',
  ],
  textures: [
    // Skybox
    '/textures/skybox/skybox.jpg',

    // Environment
    '/textures/skybox/environment.jpg',
  ],
  images: [
    // Product images
    '/ui/agroCobertura.jpg',
    '/ui/climaInteligente.jpg',
    '/ui/gestaoMaquinario.jpg',
    '/ui/gestaoPecuaria.jpg'
  ],
  videos: [
    '/videos/Tablet-AgroCobertura.mp4',
    '/videos/Tablet-GestaoMaquinario.mp4',
    '/videos/Tablet-GestaoPecuaria.mp4',
    '/videos/Tablet-ClimaInteligente.mp4'
  ],
  sounds: {
    // Interface
    BUTTON_CLICK: '/audio/Geral/Click.mp3',
    SLOT_CLICK: '/audio/Geral/Grab.mp3',

    // Efeitos
    NEON_APPEAR: '/audio/Produtos/Geral/Swoosh.mp3',
    ACTIVATION: '/audio/Produtos/Geral/Activation.mp3',
    ENDING: '/audio/Produtos/Geral/Ending.mp3',

    // Sons de produtos
    TRATOR_A: '/audio/Produtos/GestaoMaquinario/tractor.mp3',
    TRATOR_B: '/audio/Produtos/GestaoMaquinario/tractor.mp3',
    TRATOR_C: '/audio/Produtos/GestaoMaquinario/tractor.mp3',
    VACA_A: '/audio/Produtos/GestaoPecuaria/Vaca-A.mp3',
    VACA_B: '/audio/Produtos/GestaoPecuaria/Vaca-B.mp3',

    // Ambiente
    AMBIENT: '/audio/Fazenda/Ambiance.mp3',
  }
};

const useAssetsStore = create((set, get) => ({
  isLoading: true,
  loadingProgress: 0,
  totalAssets: assets.models.length + assets.textures.length +
    assets.images.length + assets.videos.length +
    Object.keys(assets.sounds).length,
  loadedAssets: 0,

  //modelCache: {},
  textureCache: {},
  imageCache: {},
  videoCache: {},
  soundCache: {},

  loadAllAssets: () => {
    const { incrementLoadedAssets } = get();
    const textureLoader = new TextureLoader();
    const rgbeLoader = new RGBELoader();

    // Carregar modelos
    assets.models.forEach(modelPath => {
      useGLTF.preload(modelPath);
      incrementLoadedAssets();
    });

    // Carregar texturas
    assets.textures.forEach(texturePath => {
      // Verificar se é um arquivo HDR
      if (texturePath.endsWith('.hdr')) {
        rgbeLoader.load(
          texturePath,
          (loadedTexture) => {
            get().textureCache[texturePath] = loadedTexture;
            incrementLoadedAssets();
          },
          (progress) => {
            // 
          },
          (error) => {
            console.error(`Erro carregando HDR ${texturePath}:`, error);
            incrementLoadedAssets();
          }
        );
      } else {
        textureLoader.load(
          texturePath,
          (loadedTexture) => {
            get().textureCache[texturePath] = loadedTexture;
            incrementLoadedAssets();
          },
          (progress) => {
            // 
          },
          (error) => {
            console.error(`Erro carregando textura ${texturePath}:`, error);
            incrementLoadedAssets();
          }
        );
      }
    });

    // Carregar images 
    assets.images.forEach(imagePath => {
      const img = new Image();

      img.onload = () => {
        // Armazenar a imagem carregada no cache
        get().imageCache[imagePath] = img;
        incrementLoadedAssets();
      };

      img.onerror = () => {
        console.error(`Erro ao carregar imagem: ${imagePath}`);
        incrementLoadedAssets();
      };

      img.src = imagePath;
    });

    // Carregar vídeos
    assets.videos.forEach(videoPath => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.loop = true;
      video.muted = true; // Necessario para autoplay sem interação
      video.playsInline = true;

      // Para alguns navegadores é necessario definir o tamanho
      video.width = 1920;
      video.height = 1080;

      // Indica que o vídeo está pronto para ser usado
      video.oncanplaythrough = () => {
        get().videoCache[videoPath] = video;
        incrementLoadedAssets();
      };

      video.onerror = () => {
        console.error(`Erro ao carregar vídeo: ${videoPath}`);
        incrementLoadedAssets();
      };

      video.src = videoPath;
      video.load();
    });

    Object.entries(assets.sounds).forEach(([soundId, soundPath]) => {
      const sound = new Howl({
        src: [soundPath],
        preload: true,
        onload: () => {
          get().soundCache[soundId] = sound;
          incrementLoadedAssets();
        },
        onloaderror: (id, error) => {
          console.error(`Erro ao carregar som ${soundId}:`, error);
          incrementLoadedAssets();
        }
      });
    });

  },

  // Atualizar o progresso
  incrementLoadedAssets: () => {
    set(state => {
      const loadedAssets = state.loadedAssets + 1;
      const loadingProgress = (loadedAssets / state.totalAssets) * 100;
      const isLoading = loadedAssets < state.totalAssets;

      return {
        loadedAssets,
        loadingProgress,
        isLoading
      };
    });
  },

  // Obter modelo
  /*   getModel: (path) => {
      return get().modelCache[path];
    }, */

  // Obter textura 
  getTexture: (path) => {
    return get().textureCache[path];
  },
  // Obter imagem
  getUIImage: (path) => {
    return get().imageCache[path];
  },
  // Obter video
  getVideo: (path) => {
    return get().videoCache[path];
  },
  // Obter sounds
  getSound: (soundId) => {
    return get().soundCache[soundId];
  },

}));

export default useAssetsStore;