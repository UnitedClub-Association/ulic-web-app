/**
 * themes.ts
 *
 * This file exports a single object containing all available theme definitions,
 * fully typed with TypeScript.
 * Each theme has a set of CSS variables that define its color palette and fonts.
 * The theme engine uses this object to dynamically apply styles.
 */

// Type definition for a single theme's variables
type ThemeVars = Record<string, string>;

// Type definition for a single theme object
type Theme = {
  name: string;
  vars: ThemeVars;
};

// Type definition for a category of themes
type ThemeCategory = Record<string, Theme>;

// The main themes object, fully typed
export const themes: Record<string, ThemeCategory> = {
    "Neon & Cyberpunk": {
        "tokyo-night": {
            name: "Tokyo Night",
            vars: {
                "--bg-color": "#1a1b26",
                "--bg-secondary": "#16161e",
                "--card-bg": "rgba(22, 22, 30, 0.7)",
                "--border-color": "rgba(72, 73, 89, 0.5)",
                "--text-color": "#a9b1d6",
                "--text-muted": "#565f89",
                "--primary-glow": "#7aa2f7",
                "--secondary-glow": "#bb9af7",
                "--font-primary": "'Azonix', sans-serif",
                "--font-secondary": "'Molgan', sans-serif",
                "--font-body": "'Xeroda', sans-serif",
                "--font-astro": "'A Astro Space', sans-serif"
            }
        },
        "synthwave-sunset": { name: "Synthwave Sunset", vars: { "--bg-color": "#21153C", "--bg-secondary": "#1a1030", "--card-bg": "rgba(49, 34, 84, 0.8)", "--border-color": "rgba(90, 69, 140, 0.5)", "--text-color": "#F5EFFF", "--text-muted": "#9A8EBF", "--primary-glow": "#FF00A8", "--secondary-glow": "#00E5FF" }},
        "arcane-matrix": { name: "Arcane Matrix", vars: { "--bg-color": "#021c13", "--bg-secondary": "#01140d", "--card-bg": "rgba(4, 43, 29, 0.8)", "--border-color": "rgba(13, 87, 60, 0.5)", "--text-color": "#E0F5E1", "--text-muted": "#64a281", "--primary-glow": "#00ff41", "--secondary-glow": "#a0f0c0" }},
        "crimson-cyberspace": { name: "Crimson Cyberspace", vars: { "--bg-color": "#300000", "--bg-secondary": "#210000", "--card-bg": "rgba(87, 0, 0, 0.8)", "--border-color": "rgba(140, 29, 29, 0.5)", "--text-color": "#ffdada", "--text-muted": "#d38989", "--primary-glow": "#ff1818", "--secondary-glow": "#ffffff" }},
        "oceanic-depth": { name: "Oceanic Depth", vars: { "--bg-color": "#0b2240", "--bg-secondary": "#06172e", "--card-bg": "rgba(11, 51, 92, 0.8)", "--border-color": "rgba(33, 89, 147, 0.5)", "--text-color": "#e6f7ff", "--text-muted": "#89b3d9", "--primary-glow": "#00ffff", "--secondary-glow": "#98ff98" }},
        "hacker-green": { name: "Hacker Green", vars: { "--bg-color": "#001a00", "--bg-secondary": "#000d00", "--card-bg": "rgba(0, 43, 0, 0.8)", "--border-color": "rgba(0, 87, 0, 0.5)", "--text-color": "#00ff00", "--text-muted": "#008f00", "--primary-glow": "#33ff33", "--secondary-glow": "#ffffff" }},
        "laser-lemon": { name: "Laser Lemon", vars: { "--bg-color": "#282700", "--bg-secondary": "#1c1b00", "--card-bg": "rgba(69, 66, 0, 0.8)", "--border-color": "rgba(112, 107, 0, 0.5)", "--text-color": "#fffedd", "--text-muted": "#b1ad70", "--primary-glow": "#fffb00", "--secondary-glow": "#00e5ff" }},
        "glitch-pop": { name: "Glitch Pop", vars: { "--bg-color": "#0c0032", "--bg-secondary": "#06001f", "--card-bg": "rgba(35, 0, 80, 0.8)", "--border-color": "rgba(74, 29, 140, 0.5)", "--text-color": "#e8dffc", "--text-muted": "#9c8db9", "--primary-glow": "#ff00c1", "--secondary-glow": "#00ffc8" }},
        "cyber-orange": { name: "Cyber Orange", vars: { "--bg-color": "#331a00", "--bg-secondary": "#241200", "--card-bg": "rgba(87, 43, 0, 0.8)", "--border-color": "rgba(140, 70, 0, 0.5)", "--text-color": "#fff2e6", "--text-muted": "#d3a989", "--primary-glow": "#ff8c00", "--secondary-glow": "#ff1818" }},
        "plasma-pink": { name: "Plasma Pink", vars: { "--bg-color": "#2E002E", "--bg-secondary": "#1F001F", "--card-bg": "rgba(74, 0, 74, 0.8)", "--border-color": "rgba(117, 29, 117, 0.5)", "--text-color": "#FFD6FF", "--text-muted": "#C4A0C4", "--primary-glow": "#FF00FF", "--secondary-glow": "#00FFFF" }},
        "android-dream": { name: "Android Dream", vars: { "--bg-color": "#0F1D1A", "--bg-secondary": "#091411", "--card-bg": "rgba(23, 48, 41, 0.8)", "--border-color": "rgba(48, 87, 76, 0.5)", "--text-color": "#D7F7EE", "--text-muted": "#93B5AC", "--primary-glow": "#3DDC84", "--secondary-glow": "#A0E9FF" }},
        "virtual-violet": { name: "Virtual Violet", vars: { "--bg-color": "#1D103B", "--bg-secondary": "#130A28", "--card-bg": "rgba(48, 28, 92, 0.8)", "--border-color": "rgba(81, 58, 140, 0.5)", "--text-color": "#EAE0FF", "--text-muted": "#A998D4", "--primary-glow": "#9F50FF", "--secondary-glow": "#00E5FF" }},
    },
    "Corporate & Minimalist": {
        "graphite": { name: "Graphite", vars: { "--bg-color": "#2d2d2d", "--bg-secondary": "#1f1f1f", "--card-bg": "rgba(71, 71, 71, 0.8)", "--border-color": "rgba(100, 100, 100, 0.5)", "--text-color": "#f5f5f5", "--text-muted": "#a0a0a0", "--primary-glow": "#ffffff", "--secondary-glow": "#007acc" }},
        "slate": { name: "Slate", vars: { "--bg-color": "#334155", "--bg-secondary": "#1e293b", "--card-bg": "rgba(71, 85, 105, 0.8)", "--border-color": "rgba(100, 116, 139, 0.5)", "--text-color": "#f1f5f9", "--text-muted": "#94a3b8", "--primary-glow": "#38bdf8", "--secondary-glow": "#f472b6" }},
        "aetherium": { name: "Aetherium", vars: { "--bg-color": "#282c34", "--bg-secondary": "#1e2127", "--card-bg": "rgba(60, 66, 78, 0.8)", "--border-color": "rgba(90, 99, 115, 0.5)", "--text-color": "#abb2bf", "--text-muted": "#7f848e", "--primary-glow": "#61afef", "--secondary-glow": "#e06c75" }},
        "quantum-core": { name: "Quantum Core", vars: { "--bg-color": "#0D1321", "--bg-secondary": "#070a14", "--card-bg": "rgba(26, 37, 61, 0.8)", "--border-color": "rgba(63, 83, 120, 0.5)", "--text-color": "#F0F8FF", "--text-muted": "#8194B0", "--primary-glow": "#FFD700", "--secondary-glow": "#4682B4" }},
        "midnight-blue": { name: "Midnight Blue", vars: { "--bg-color": "#191970", "--bg-secondary": "#0d0d52", "--card-bg": "rgba(43, 43, 138, 0.8)", "--border-color": "rgba(70, 70, 163, 0.5)", "--text-color": "#e6e6fa", "--text-muted": "#b3b3d9", "--primary-glow": "#add8e6", "--secondary-glow": "#ffffff" }},
        "charcoal": { name: "Charcoal", vars: { "--bg-color": "#36454f", "--bg-secondary": "#242e36", "--card-bg": "rgba(78, 93, 104, 0.8)", "--border-color": "rgba(107, 121, 131, 0.5)", "--text-color": "#f0f8ff", "--text-muted": "#a4b0b9", "--primary-glow": "#e0e0e0", "--secondary-glow": "#ff6347" }},
        "obsidian": { name: "Obsidian", vars: { "--bg-color": "#0b0c10", "--bg-secondary": "#000000", "--card-bg": "rgba(28, 32, 41, 0.8)", "--border-color": "rgba(54, 59, 72, 0.5)", "--text-color": "#c5c6c7", "--text-muted": "#66fcf1", "--primary-glow": "#45a29e", "--secondary-glow": "#c5c6c7" }},
        "steel": { name: "Steel", vars: { "--bg-color": "#464a52", "--bg-secondary": "#313338", "--card-bg": "rgba(94, 99, 107, 0.8)", "--border-color": "rgba(121, 125, 133, 0.5)", "--text-color": "#ffffff", "--text-muted": "#b5bac1", "--primary-glow": "#5865f2", "--secondary-glow": "#eb459e" }},
        "onyx": { name: "Onyx", vars: { "--bg-color": "#353935", "--bg-secondary": "#242724", "--card-bg": "rgba(77, 81, 77, 0.8)", "--border-color": "rgba(106, 109, 106, 0.5)", "--text-color": "#f5f5f5", "--text-muted": "#c0c0c0", "--primary-glow": "#98ff98", "--secondary-glow": "#ffffff" }},
        "arctic-white": { name: "Arctic White", vars: { "--bg-color": "#F9FAFB", "--bg-secondary": "#F3F4F6", "--card-bg": "rgba(255, 255, 255, 0.8)", "--border-color": "rgba(209, 213, 219, 0.5)", "--text-color": "#1F2937", "--text-muted": "#6B7280", "--primary-glow": "#3B82F6", "--secondary-glow": "#EF4444" }},
        "sandstone": { name: "Sandstone", vars: { "--bg-color": "#FDF6E3", "--bg-secondary": "#F5EFE0", "--card-bg": "rgba(245, 239, 224, 0.8)", "--border-color": "rgba(204, 194, 178, 0.5)", "--text-color": "#657B83", "--text-muted": "#93A1A1", "--primary-glow": "#268BD2", "--secondary-glow": "#CB4B16" }},
        "executive-gray": { name: "Executive Gray", vars: { "--bg-color": "#4A5568", "--bg-secondary": "#2D3748", "--card-bg": "rgba(113, 128, 150, 0.8)", "--border-color": "rgba(160, 174, 192, 0.5)", "--text-color": "#F7FAFC", "--text-muted": "#A0AEC0", "--primary-glow": "#4299E1", "--secondary-glow": "#ED8936" }},
    },
    "Natural & Organic": {
        "solar-flare": { name: "Solar Flare", vars: { "--bg-color": "#2b1d1d", "--bg-secondary": "#1f1515", "--card-bg": "rgba(71, 44, 44, 0.8)", "--border-color": "rgba(122, 70, 70, 0.5)", "--text-color": "#fff0e6", "--text-muted": "#d1a3a3", "--primary-glow": "#ff4d00", "--secondary-glow": "#ffab58" }},
        "biomechanical-jade": { name: "Biomechanical Jade", vars: { "--bg-color": "#122c23", "--bg-secondary": "#0c1f18", "--card-bg": "rgba(26, 74, 56, 0.8)", "--border-color": "rgba(56, 128, 99, 0.5)", "--text-color": "#e8fff5", "--text-muted": "#82c5aa", "--primary-glow": "#33ff99", "--secondary-glow": "#ffc300" }},
        "forest-floor": { name: "Forest Floor", vars: { "--bg-color": "#1e2a21", "--bg-secondary": "#141d16", "--card-bg": "rgba(48, 66, 52, 0.8)", "--border-color": "rgba(79, 99, 83, 0.5)", "--text-color": "#e8f5e9", "--text-muted": "#a5d6a7", "--primary-glow": "#81c784", "--secondary-glow": "#fff59d" }},
        "deep-earth": { name: "Deep Earth", vars: { "--bg-color": "#3e2723", "--bg-secondary": "#2a1a18", "--card-bg": "rgba(84, 61, 55, 0.8)", "--border-color": "rgba(111, 89, 84, 0.5)", "--text-color": "#efebe9", "--text-muted": "#bcaaa4", "--primary-glow": "#ffab91", "--secondary-glow": "#a1887f" }},
        "autumn-embers": { name: "Autumn Embers", vars: { "--bg-color": "#4e342e", "--bg-secondary": "#3e2723", "--card-bg": "rgba(109, 76, 65, 0.8)", "--border-color": "rgba(141, 110, 99, 0.5)", "--text-color": "#fff3e0", "--text-muted": "#ffccbc", "--primary-glow": "#ff8a65", "--secondary-glow": "#ffb74d" }},
        "volcanic-ash": { name: "Volcanic Ash", vars: { "--bg-color": "#263238", "--bg-secondary": "#1a2226", "--card-bg": "rgba(55, 71, 79, 0.8)", "--border-color": "rgba(84, 110, 122, 0.5)", "--text-color": "#eceff1", "--text-muted": "#b0bec5", "--primary-glow": "#ff7043", "--secondary-glow": "#ffca28" }},
        "desert-night": { name: "Desert Night", vars: { "--bg-color": "#3e2723", "--bg-secondary": "#2a1a18", "--card-bg": "rgba(84, 61, 55, 0.8)", "--border-color": "rgba(111, 89, 84, 0.5)", "--text-color": "#efebe9", "--text-muted": "#bcaaa4", "--primary-glow": "#f06292", "--secondary-glow": "#4fc3f7" }},
        "mossy-stone": { name: "Mossy Stone", vars: { "--bg-color": "#37474f", "--bg-secondary": "#263238", "--card-bg": "rgba(78, 93, 104, 0.8)", "--border-color": "rgba(107, 121, 131, 0.5)", "--text-color": "#cfd8dc", "--text-muted": "#90a4ae", "--primary-glow": "#a5d6a7", "--secondary-glow": "#b0bec5" }},
        "coral-reef": { name: "Coral Reef", vars: { "--bg-color": "#004D40", "--bg-secondary": "#00382E", "--card-bg": "rgba(0, 105, 92, 0.8)", "--border-color": "rgba(38, 133, 120, 0.5)", "--text-color": "#E0F2F1", "--text-muted": "#B2DFDB", "--primary-glow": "#FF4081", "--secondary-glow": "#FFEB3B" }},
        "glacial-ice": { name: "Glacial Ice", vars: { "--bg-color": "#2C3E50", "--bg-secondary": "#1F2C39", "--card-bg": "rgba(62, 84, 109, 0.8)", "--border-color": "rgba(90, 112, 138, 0.5)", "--text-color": "#ECF0F1", "--text-muted": "#BDC3C7", "--primary-glow": "#3498DB", "--secondary-glow": "#FFFFFF" }},
        "canyon-clay": { name: "Canyon Clay", vars: { "--bg-color": "#795548", "--bg-secondary": "#5D4037", "--card-bg": "rgba(141, 110, 99, 0.8)", "--border-color": "rgba(161, 136, 127, 0.5)", "--text-color": "#D7CCC8", "--text-muted": "#BCAAA4", "--primary-glow": "#FF9800", "--secondary-glow": "#FF5722" }},
    },
    "Mystical & Fantasy": {
        "nebula-glow": { name: "Nebula Glow", vars: { "--bg-color": "#241838", "--bg-secondary": "#1e132d", "--card-bg": "rgba(61, 44, 90, 0.8)", "--border-color": "rgba(106, 83, 155, 0.5)", "--text-color": "#E9E4F7", "--text-muted": "#8A7FAD", "--primary-glow": "#50FAFA", "--secondary-glow": "#C67DFF" }},
        "dragon-fire": { name: "Dragon Fire", vars: { "--bg-color": "#4a0e0e", "--bg-secondary": "#330a0a", "--card-bg": "rgba(105, 23, 23, 0.8)", "--border-color": "rgba(133, 51, 51, 0.5)", "--text-color": "#ffe5e5", "--text-muted": "#ffb3b3", "--primary-glow": "#ff4500", "--secondary-glow": "#ffd700" }},
        "voidwood": { name: "Voidwood", vars: { "--bg-color": "#2c2233", "--bg-secondary": "#1e1824", "--card-bg": "rgba(72, 59, 84, 0.8)", "--border-color": "rgba(111, 94, 128, 0.5)", "--text-color": "#f3e8ff", "--text-muted": "#bdaecf", "--primary-glow": "#d8baff", "--secondary-glow": "#fff5b8" }},
        "elven-silver": { name: "Elven Silver", vars: { "--bg-color": "#2f4f4f", "--bg-secondary": "#203636", "--card-bg": "rgba(68, 107, 107, 0.8)", "--border-color": "rgba(97, 134, 134, 0.5)", "--text-color": "#e0ffff", "--text-muted": "#b0e0e6", "--primary-glow": "#afeeee", "--secondary-glow": "#ffffff" }},
        "starlight": { name: "Starlight", vars: { "--bg-color": "#000033", "--bg-secondary": "#00001f", "--card-bg": "rgba(25, 25, 112, 0.8)", "--border-color": "rgba(51, 51, 138, 0.5)", "--text-color": "#f0f8ff", "--text-muted": "#b0c4de", "--primary-glow": "#fafad2", "--secondary-glow": "#ffffff" }},
        "ghostly": { name: "Ghostly", vars: { "--bg-color": "#3c4245", "--bg-secondary": "#2a2d30", "--card-bg": "rgba(82, 88, 92, 0.8)", "--border-color": "rgba(110, 116, 120, 0.5)", "--text-color": "#e6f2f2", "--text-muted": "#b3c2c2", "--primary-glow": "#7fffd4", "--secondary-glow": "#f5f5f5" }},
        "phoenix-feather": { name: "Phoenix Feather", vars: { "--bg-color": "#5d2b1c", "--bg-secondary": "#4a2216", "--card-bg": "rgba(125, 60, 42, 0.8)", "--border-color": "rgba(158, 88, 69, 0.5)", "--text-color": "#fff6e5", "--text-muted": "#ffcda9", "--primary-glow": "#ff5733", "--secondary-glow": "#ffc300" }},
        "shadowfell": { name: "Shadowfell", vars: { "--bg-color": "#242124", "--bg-secondary": "#1a171a", "--card-bg": "rgba(54, 50, 54, 0.8)", "--border-color": "rgba(82, 78, 82, 0.5)", "--text-color": "#e8e6e8", "--text-muted": "#a6a3a6", "--primary-glow": "#9370db", "--secondary-glow": "#c0c0c0" }},
        "fae-wilds": { name: "Fae Wilds", vars: { "--bg-color": "#1A001A", "--bg-secondary": "#0F000F", "--card-bg": "rgba(43, 0, 43, 0.8)", "--border-color": "rgba(79, 29, 79, 0.5)", "--text-color": "#FAD6FA", "--text-muted": "#C2A3C2", "--primary-glow": "#AB47BC", "--secondary-glow": "#00FF7F" }},
        "sunken-treasure": { name: "Sunken Treasure", vars: { "--bg-color": "#003333", "--bg-secondary": "#002424", "--card-bg": "rgba(0, 77, 77, 0.8)", "--border-color": "rgba(29, 105, 105, 0.5)", "--text-color": "#E0FFFF", "--text-muted": "#B3E0E0", "--primary-glow": "#FFD700", "--secondary-glow": "#00E5EE" }},
        "crystal-caverns": { name: "Crystal Caverns", vars: { "--bg-color": "#2E0854", "--bg-secondary": "#1F0538", "--card-bg": "rgba(74, 13, 133, 0.8)", "--border-color": "rgba(112, 48, 179, 0.5)", "--text-color": "#F3E8FF", "--text-muted": "#D8B9FF", "--primary-glow": "#BA55D3", "--secondary-glow": "#00BFFF" }},
    },
    "Retro & Vintage": {
        "vaporwave": { name: "Vaporwave", vars: { "--bg-color": "#2c003e", "--bg-secondary": "#1e002a", "--card-bg": "rgba(72, 0, 100, 0.8)", "--border-color": "rgba(108, 29, 140, 0.5)", "--text-color": "#f3e8ff", "--text-muted": "#d8baff", "--primary-glow": "#00ffff", "--secondary-glow": "#ff00ff" }},
        "8-bit-adventure": { name: "8-Bit Adventure", vars: { "--bg-color": "#2d2d2d", "--bg-secondary": "#1f1f1f", "--card-bg": "rgba(71, 71, 71, 0.8)", "--border-color": "rgba(100, 100, 100, 0.5)", "--text-color": "#ffffff", "--text-muted": "#a0a0a0", "--primary-glow": "#ff0000", "--secondary-glow": "#0000ff" }},
        "sepia-tone": { name: "Sepia Tone", vars: { "--bg-color": "#4e423a", "--bg-secondary": "#3b312c", "--card-bg": "rgba(109, 93, 82, 0.8)", "--border-color": "rgba(141, 121, 110, 0.5)", "--text-color": "#f5eadd", "--text-muted": "#d3c5ba", "--primary-glow": "#d2b48c", "--secondary-glow": "#ffffff" }},
        "groovy": { name: "Groovy", vars: { "--bg-color": "#4a2e0a", "--bg-secondary": "#332007", "--card-bg": "rgba(105, 66, 14, 0.8)", "--border-color": "rgba(133, 94, 42, 0.5)", "--text-color": "#fff8e1", "--text-muted": "#ffcc80", "--primary-glow": "#ff9800", "--secondary-glow": "#e91e63" }},
        "art-deco": { name: "Art Deco", vars: { "--bg-color": "#2c3e50", "--bg-secondary": "#1a2530", "--card-bg": "rgba(62, 84, 109, 0.8)", "--border-color": "rgba(90, 112, 138, 0.5)", "--text-color": "#ecf0f1", "--text-muted": "#bdc3c7", "--primary-glow": "#f1c40f", "--secondary-glow": "#e0e0e0" }},
        "nautical": { name: "Nautical", vars: { "--bg-color": "#000080", "--bg-secondary": "#00005a", "--card-bg": "rgba(0, 0, 179, 0.8)", "--border-color": "rgba(29, 29, 204, 0.5)", "--text-color": "#ffffff", "--text-muted": "#b0c4de", "--primary-glow": "#ff4500", "--secondary-glow": "#ffd700" }},
        "cassette-tape": { name: "Cassette Tape", vars: { "--bg-color": "#3a3a3a", "--bg-secondary": "#292929", "--card-bg": "rgba(82, 82, 82, 0.8)", "--border-color": "rgba(110, 110, 110, 0.5)", "--text-color": "#f5f5f5", "--text-muted": "#c0c0c0", "--primary-glow": "#ff69b4", "--secondary-glow": "#00bfff" }},
        "vintage-poster": { name: "Vintage Poster", vars: { "--bg-color": "#3e3e3e", "--bg-secondary": "#2b2b2b", "--card-bg": "rgba(87, 87, 87, 0.8)", "--border-color": "rgba(115, 115, 115, 0.5)", "--text-color": "#fff9e6", "--text-muted": "#ffe4b3", "--primary-glow": "#ff4c4c", "--secondary-glow": "#4c91ff" }},
        "atomic-age": { name: "Atomic Age", vars: { "--bg-color": "#3d4c41", "--bg-secondary": "#2a352c", "--card-bg": "rgba(84, 104, 89, 0.8)", "--border-color": "rgba(111, 131, 117, 0.5)", "--text-color": "#e0f2e9", "--text-muted": "#b3d9c7", "--primary-glow": "#ff6f61", "--secondary-glow": "#88b04b" }},
        "pop-art": { name: "Pop Art", vars: { "--bg-color": "#004ba0", "--bg-secondary": "#00336e", "--card-bg": "rgba(0, 105, 179, 0.8)", "--border-color": "rgba(29, 133, 204, 0.5)", "--text-color": "#ffffff", "--text-muted": "#b3d9ff", "--primary-glow": "#ffd700", "--secondary-glow": "#ff0000" }},
        "film-noir": { name: "Film Noir", vars: { "--bg-color": "#222222", "--bg-secondary": "#111111", "--card-bg": "rgba(51, 51, 51, 0.8)", "--border-color": "rgba(85, 85, 85, 0.5)", "--text-color": "#EAEAEA", "--text-muted": "#A9A9A9", "--primary-glow": "#FFFFFF", "--secondary-glow": "#FF4136" }},
        "diner-days": { name: "Diner Days", vars: { "--bg-color": "#4A90E2", "--bg-secondary": "#357ABD", "--card-bg": "rgba(113, 174, 242, 0.8)", "--border-color": "rgba(145, 193, 247, 0.5)", "--text-color": "#FFFFFF", "--text-muted": "#D4E5F7", "--primary-glow": "#F5A623", "--secondary-glow": "#D0021B" }},
    },
    "Sci-Fi & Space": {
        "starship-bridge": { name: "Starship Bridge", vars: { "--bg-color": "#1c2a38", "--bg-secondary": "#121c26", "--card-bg": "rgba(44, 62, 80, 0.8)", "--border-color": "rgba(76, 94, 112, 0.5)", "--text-color": "#ecf0f1", "--text-muted": "#95a5a6", "--primary-glow": "#3498db", "--secondary-glow": "#e67e22" }},
        "alien-jungle": { name: "Alien Jungle", vars: { "--bg-color": "#1D2B2A", "--bg-secondary": "#121F1E", "--card-bg": "rgba(44, 69, 67, 0.8)", "--border-color": "rgba(71, 102, 99, 0.5)", "--text-color": "#E3F2F1", "--text-muted": "#9FBDBA", "--primary-glow": "#F72585", "--secondary-glow": "#7209B7" }},
        "martian-colony": { name: "Martian Colony", vars: { "--bg-color": "#5E2C04", "--bg-secondary": "#4A2303", "--card-bg": "rgba(128, 62, 9, 0.8)", "--border-color": "rgba(163, 88, 29, 0.5)", "--text-color": "#FFEADD", "--text-muted": "#D4B49C", "--primary-glow": "#FF8A65", "--secondary-glow": "#4FC3F7" }},
        "black-hole": { name: "Black Hole", vars: { "--bg-color": "#000000", "--bg-secondary": "#080808", "--card-bg": "rgba(20, 20, 20, 0.8)", "--border-color": "rgba(50, 50, 50, 0.5)", "--text-color": "#FFFFFF", "--text-muted": "#A9A9A9", "--primary-glow": "#7F00FF", "--secondary-glow": "#FF007F" }},
        "galactic-core": { name: "Galactic Core", vars: { "--bg-color": "#0D0221", "--bg-secondary": "#070114", "--card-bg": "rgba(26, 4, 61, 0.8)", "--border-color": "rgba(58, 29, 102, 0.5)", "--text-color": "#F0E9FF", "--text-muted": "#A89ACF", "--primary-glow": "#F9C80E", "--secondary-glow": "#F86624" }},
        "ice-planet": { name: "Ice Planet", vars: { "--bg-color": "#2B3A42", "--bg-secondary": "#1E282D", "--card-bg": "rgba(61, 80, 92, 0.8)", "--border-color": "rgba(90, 109, 120, 0.5)", "--text-color": "#E4F1F6", "--text-muted": "#A2B6BF", "--primary-glow": "#00E0FF", "--secondary-glow": "#FFFFFF" }},
    },
    "Monochromatic": {
        "grayscale": { name: "Grayscale", vars: { "--bg-color": "#2E2E2E", "--bg-secondary": "#1E1E1E", "--card-bg": "rgba(74, 74, 74, 0.8)", "--border-color": "rgba(117, 117, 117, 0.5)", "--text-color": "#E0E0E0", "--text-muted": "#BDBDBD", "--primary-glow": "#FFFFFF", "--secondary-glow": "#9E9E9E" }},
        "blueberry": { name: "Blueberry", vars: { "--bg-color": "#0D1B2A", "--bg-secondary": "#07121D", "--card-bg": "rgba(26, 46, 69, 0.8)", "--border-color": "rgba(54, 78, 105, 0.5)", "--text-color": "#E0E1DD", "--text-muted": "#A1A6A3", "--primary-glow": "#415A77", "--secondary-glow": "#778DA9" }},
        "matcha": { name: "Matcha", vars: { "--bg-color": "#283618", "--bg-secondary": "#1D2711", "--card-bg": "rgba(64, 84, 39, 0.8)", "--border-color": "rgba(94, 115, 68, 0.5)", "--text-color": "#FEFAE0", "--text-muted": "#D4D2BC", "--primary-glow": "#606C38", "--secondary-glow": "#BC6C25" }},
        "rosewater": { name: "Rosewater", vars: { "--bg-color": "#4A0E2E", "--bg-secondary": "#360A22", "--card-bg": "rgba(105, 23, 66, 0.8)", "--border-color": "rgba(133, 51, 94, 0.5)", "--text-color": "#FFDDEE", "--text-muted": "#D4A8C1", "--primary-glow": "#C15B78", "--secondary-glow": "#E8A8B9" }},
        "lavender": { name: "Lavender", vars: { "--bg-color": "#242038", "--bg-secondary": "#1A1628", "--card-bg": "rgba(54, 48, 82, 0.8)", "--border-color": "rgba(82, 76, 110, 0.5)", "--text-color": "#CAC4CE", "--text-muted": "#908D9E", "--primary-glow": "#725AC1", "--secondary-glow": "#8D86C9" }},
    },
    "High Contrast": {
        "dracula": { name: "Dracula", vars: { "--bg-color": "#282a36", "--bg-secondary": "#21222c", "--card-bg": "rgba(68, 71, 90, 0.8)", "--border-color": "rgba(98, 114, 164, 0.5)", "--text-color": "#f8f8f2", "--text-muted": "#6272a4", "--primary-glow": "#bd93f9", "--secondary-glow": "#50fa7b" }},
        "nord": { name: "Nord", vars: { "--bg-color": "#2E3440", "--bg-secondary": "#242933", "--card-bg": "rgba(70, 78, 95, 0.8)", "--border-color": "rgba(94, 104, 124, 0.5)", "--text-color": "#D8DEE9", "--text-muted": "#4C566A", "--primary-glow": "#88C0D0", "--secondary-glow": "#BF616A" }},
        "gruvbox": { name: "Gruvbox", vars: { "--bg-color": "#282828", "--bg-secondary": "#1d2021", "--card-bg": "rgba(50, 48, 47, 0.8)", "--border-color": "rgba(80, 73, 69, 0.5)", "--text-color": "#ebdbb2", "--text-muted": "#928374", "--primary-glow": "#fabd2f", "--secondary-glow": "#83a598" }},
        "solarized-dark": { name: "Solarized Dark", vars: { "--bg-color": "#002b36", "--bg-secondary": "#001f27", "--card-bg": "rgba(7, 54, 66, 0.8)", "--border-color": "rgba(42, 83, 94, 0.5)", "--text-color": "#839496", "--text-muted": "#586e75", "--primary-glow": "#268bd2", "--secondary-glow": "#b58900" }},
        "monokai": { name: "Monokai", vars: { "--bg-color": "#272822", "--bg-secondary": "#1e1e19", "--card-bg": "rgba(61, 62, 53, 0.8)", "--border-color": "rgba(89, 90, 80, 0.5)", "--text-color": "#F8F8F2", "--text-muted": "#75715E", "--primary-glow": "#A6E22E", "--secondary-glow": "#F92672" }},
    },
    "Playful & Bright": {
        "bubblegum": { name: "Bubblegum", vars: { "--bg-color": "#2E1A47", "--bg-secondary": "#211333", "--card-bg": "rgba(74, 42, 112, 0.8)", "--border-color": "rgba(107, 69, 145, 0.5)", "--text-color": "#F3E8FF", "--text-muted": "#D8B9FF", "--primary-glow": "#FF69B4", "--secondary-glow": "#00BFFF" }},
        "citrus-splash": { name: "Citrus Splash", vars: { "--bg-color": "#004B23", "--bg-secondary": "#00381B", "--card-bg": "rgba(0, 105, 51, 0.8)", "--border-color": "rgba(29, 133, 79, 0.5)", "--text-color": "#CCFF33", "--text-muted": "#A3CC29", "--primary-glow": "#FFC300", "--secondary-glow": "#FF5733" }},
        "candy-land": { name: "Candy Land", vars: { "--bg-color": "#1D1A3D", "--bg-secondary": "#131129", "--card-bg": "rgba(48, 42, 94, 0.8)", "--border-color": "rgba(76, 69, 122, 0.5)", "--text-color": "#EAE8FF", "--text-muted": "#A9A5D4", "--primary-glow": "#FF8FAB", "--secondary-glow": "#84D2F6" }},
        "summer-sky": { name: "Summer Sky", vars: { "--bg-color": "#0077B6", "--bg-secondary": "#005E91", "--card-bg": "rgba(0, 150, 214, 0.8)", "--border-color": "rgba(48, 179, 235, 0.5)", "--text-color": "#CAF0F8", "--text-muted": "#90E0EF", "--primary-glow": "#FFD60A", "--secondary-glow": "#FFFFFF" }},
        "meadow": { name: "Meadow", vars: { "--bg-color": "#2d6a4f", "--bg-secondary": "#1b4332", "--card-bg": "rgba(64, 129, 94, 0.8)", "--border-color": "rgba(91, 158, 121, 0.5)", "--text-color": "#d8f3dc", "--text-muted": "#95d5b2", "--primary-glow": "#b7e4c7", "--secondary-glow": "#ffc8dd" }},
    }
};
