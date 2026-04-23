import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

const DEFAULT_CONTENT = {
  indexHero: {
    mode: 'image',
    text: ''
  },
  whatWeDo: {
    heroTitle: "We exist to transform the coffee industry—placing farmers first, and proving that exceptional quality can be achieved while doing things the right way.",
    qualityHumanityHeading: "We blend quality with humanity, elevating both beyond expectations.",
    qualityLabel: "Quality",
    humanityLabel: "Humanity",
    victorBio: "I've been involved in the world of coffee my entire life. I'm a professional coffee roaster and cupper. In 2024, I was awarded second place in Colombia's Master Roasters Competition, along with several other recognitions. I've dedicated my life to perfecting and teaching the art of specialty coffee roasting. I've worked as a barista and barista trainer. At Encounter Coffee, I'm also in charge of coffee hunting across Colombia. I personally ensure the quality of every cup—from the farm to the final brew—overseeing sourcing, selection, and planning.",
    johnBlancaBio: "At Encounter, we travel throughout Colombia looking for small-scale farmers who cultivate coffee with true excellence. We pay them generously for their effort and expertise, ensuring their dedication is fairly rewarded. This not only encourages them to maintain the highest quality but also supports their well-being. We also offer each farmer personalized assistance based on their individual needs.\n\nCuando le preguntamos a John qué significa Encounter para él, respondió con una palabra: \"Esperanza.\"",
    camilaBio: "I was born in Colombia and am now based in Canada. Living between two cultures has shaped a unique way of seeing the world—and connecting with people.\n\nI grew up in a family where any occasion was worth celebrating, a spirit that continues to define everything I do. I'm a passionate dancer (perhaps a little too much) and a firm believer that cooking is my love language. I find joy in bringing people together through good food and genuine conversation.\n\nMy curiosity for human stories is endless. Every trip still feels exciting! Whether I'm returning home to Colombia or discovering new places, flavors (I'm a true foodie at heart), and cultures, I'm always in search of experiences that awaken the senses.\n\nBut above all, there's one thing that defines me: creating connection. Because for me, everything begins—and always comes back—to bringing people together.",
    nicoBio: "I am an entrepreneur driven by a mission to connect people and address social challenges. With a background in Universal Literature Studies and Psychology, I bring a human-centered perspective to everything I build.\n\nI am also a professional specialty coffee roaster, committed to transforming the way coffee is traded—advocating for a more equitable and transparent value chain that creates meaningful, lasting impact for coffee growers."
  }
};

const DEFAULT_VIDEOS = [
  { filename: "video1.mp4", order: 1 },
  { filename: "video2.mp4", order: 2 }
];

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

export function getContent() {
  ensureDataDir();
  const file = path.join(dataDir, 'content.json');
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(DEFAULT_CONTENT, null, 2));
    return DEFAULT_CONTENT;
  }
  try {
    const saved = JSON.parse(fs.readFileSync(file, 'utf8'));
    // Merge so new top-level keys from DEFAULT_CONTENT are always present
    return { ...DEFAULT_CONTENT, ...saved };
  } catch {
    return DEFAULT_CONTENT;
  }
}

export function saveContent(content: object) {
  ensureDataDir();
  fs.writeFileSync(path.join(dataDir, 'content.json'), JSON.stringify(content, null, 2));
}

export interface VideoEntry {
  filename: string;
  order: number;
}

export function getVideos(): VideoEntry[] {
  ensureDataDir();
  const file = path.join(dataDir, 'videos.json');
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(DEFAULT_VIDEOS, null, 2));
    return DEFAULT_VIDEOS;
  }
  try {
    const videos: VideoEntry[] = JSON.parse(fs.readFileSync(file, 'utf8'));
    return videos.sort((a, b) => a.order - b.order);
  } catch {
    return DEFAULT_VIDEOS;
  }
}

export function saveVideos(videos: VideoEntry[]) {
  ensureDataDir();
  fs.writeFileSync(path.join(dataDir, 'videos.json'), JSON.stringify(videos, null, 2));
}
