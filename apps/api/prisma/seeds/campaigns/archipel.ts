import type {
  ChapterSpec,
  CharacterSpec,
  LibrarySpec,
  ObjectiveSpec,
  QuestSpec,
} from '../builder.js';

export const ARCHIPEL_LIBRARY: LibrarySpec = {
  effects: [
    { name: 'Toucher spectral', diceCount: 1, diceSides: 8, damageType: 'nécrotique' },
    { name: 'Poing de pierre', diceCount: 2, diceSides: 6, bonus: 2, damageType: 'contondant' },
    { name: 'Rayon du vide', diceCount: 4, diceSides: 8, damageType: 'force' },
    { name: 'Lame stellaire', diceCount: 1, diceSides: 8, bonus: 2, damageType: 'feu' },
    { name: 'Ronces du Néant', diceCount: 1, diceSides: 6, damageType: 'perforant' },
    { name: 'Éboulement', diceCount: 3, diceSides: 6, damageType: 'contondant' },
    { name: 'Décharge stellaire', diceCount: 2, diceSides: 10, damageType: 'feu' },
  ],
  abilities: [
    {
      name: 'Toucher spectral',
      description: 'La main glacée du spectre traverse l’armure et fige le sang de sa victime.',
      actionType: 'ACTION',
      effect: 'Toucher spectral',
    },
    {
      name: 'Poing de pierre',
      description: 'Le gardien abat son poing de granit avec la lenteur d’une avalanche.',
      actionType: 'ACTION',
      effect: 'Poing de pierre',
    },
    {
      name: 'Rayon du vide',
      description:
        'Un trait de néant pur jaillit des mains de l’Archonte et efface ce qu’il touche.',
      actionType: 'ACTION',
      effect: 'Rayon du vide',
    },
  ],
  items: [
    {
      name: 'Lame d’étoile',
      type: 'WEAPON',
      price: 1800,
      description:
        'La lame forgée par Erwïl dans le fer d’une étoile tombée ; elle luit faiblement dans le noir.',
      effects: ['Lame stellaire'],
    },
    {
      name: 'Graine d’Ilmar',
      type: 'MISC',
      price: 0,
      description: 'Une graine dorée, tiède comme un cœur qui bat, cueillie sur l’arbre ancien.',
    },
    {
      name: 'Carte des courants',
      type: 'MISC',
      price: 150,
      description: 'Une carte des vents célestes annotée par un contrebandier de Brisevent.',
    },
    {
      name: 'Astrolabe de cristal',
      type: 'ARTIFACT',
      price: 900,
      description: 'Un astrolabe translucide qui montre la position des îles disparues.',
    },
    {
      name: 'Sceau du Néant',
      type: 'MISC',
      price: 0,
      description: 'Un disque d’obsidienne gravé d’un œil fermé, signe de ralliement des pirates.',
    },
  ],
};

export const ARCHIPEL_CHARACTERS: CharacterSpec[] = [
  {
    key: 'ancient',
    name: 'L’Ancien d’Ilmar',
    type: 'NPC',
    race: 'Elfe',
    class: 'Druide',
    occupation: 'Gardien du bosquet',
    level: 9,
    xp: 48000,
    isUnique: true,
    alignment: 'NEUTRAL_GOOD',
    stats: {
      strength: 9,
      dexterity: 12,
      constitution: 13,
      intelligence: 15,
      wisdom: 19,
      charisma: 14,
    },
    maxHp: 52,
    attitude: 'FRIENDLY',
    biography:
      'Doyen des druides d’Ilmar, il veille sur l’arbre ancien depuis plus de trois siècles. C’est lui qui a formé Alira.',
    personality:
      'Lent, énigmatique et d’une infinie patience ; il répond souvent par une question.',
    secrets: 'Il sait que le Néant se nourrit de la sève des îles pour les arracher au ciel.',
  },
  {
    key: 'orsa',
    name: 'Dame Orsa',
    type: 'NPC',
    race: 'Halfelin',
    occupation: 'Tavernière',
    level: 3,
    xp: 900,
    isUnique: true,
    alignment: 'CHAOTIC_NEUTRAL',
    stats: {
      strength: 9,
      dexterity: 14,
      constitution: 12,
      intelligence: 13,
      wisdom: 14,
      charisma: 16,
    },
    maxHp: 16,
    attitude: 'NEUTRAL',
    gold: 300,
    stock: [
      { item: 'Ration de voyage', quantity: 10 },
      { item: 'Potion de soin faible', quantity: 3 },
    ],
    biography:
      'Patronne de la taverne du Vent Tordu, Orsa sait tout ce qui se dit sur les quais de Brisevent. C’est à elle que la famille de Sélène doit de l’argent.',
    personality: 'Joviale en façade, redoutable en affaires.',
    secrets: 'Elle revend aux pirates les itinéraires des navires marchands.',
  },
  {
    key: 'lysandre',
    name: 'Lysandre, l’astronome',
    type: 'NPC',
    race: 'Humain',
    class: 'Magicien',
    occupation: 'Astronome',
    level: 6,
    xp: 14000,
    isUnique: true,
    alignment: 'NEUTRAL_GOOD',
    stats: {
      strength: 8,
      dexterity: 12,
      constitution: 11,
      intelligence: 18,
      wisdom: 14,
      charisma: 11,
    },
    maxHp: 30,
    attitude: 'FRIENDLY',
    biography:
      'Dernière gardienne de l’observatoire, Lysandre s’est barricadée dans la tour quand les spectres ont envahi les ruines.',
    personality: 'Distraite, passionnée et incapable de parler d’autre chose que des étoiles.',
    personalQuest: 'Retrouver ses carnets d’observation, éparpillés dans la salle des astrolabes.',
  },
  {
    key: 'specter',
    name: 'Spectre de l’observatoire',
    type: 'MONSTER',
    occupation: 'Mort-vivant',
    level: 4,
    xp: 1100,
    isUnique: false,
    alignment: 'CHAOTIC_EVIL',
    stats: {
      strength: 1,
      dexterity: 14,
      constitution: 11,
      intelligence: 10,
      wisdom: 10,
      charisma: 11,
    },
    maxHp: 22,
    attitude: 'HOSTILE',
    extraAbilities: ['Toucher spectral'],
    biography: 'Les âmes des astronomes, prisonnières des ruines depuis l’arrivée du Néant.',
  },
  {
    key: 'golem',
    name: 'Gardien de pierre',
    type: 'MONSTER',
    occupation: 'Construct',
    level: 5,
    xp: 1800,
    isUnique: false,
    alignment: 'TRUE_NEUTRAL',
    stats: {
      strength: 18,
      dexterity: 8,
      constitution: 18,
      intelligence: 3,
      wisdom: 10,
      charisma: 1,
    },
    maxHp: 45,
    attitude: 'HOSTILE',
    extraAbilities: ['Poing de pierre'],
    biography: 'Statues animées chargées de protéger les lieux anciens de l’archipel.',
  },
  {
    key: 'morgal',
    name: 'Morgal, capitaine du Néant',
    type: 'NPC',
    race: 'Humain',
    class: 'Guerrier',
    occupation: 'Capitaine pirate',
    level: 7,
    xp: 23000,
    isUnique: true,
    isBoss: true,
    alignment: 'NEUTRAL_EVIL',
    stats: {
      strength: 17,
      dexterity: 14,
      constitution: 15,
      intelligence: 12,
      wisdom: 10,
      charisma: 15,
    },
    maxHp: 68,
    attitude: 'HOSTILE',
    gold: 400,
    wornArmor: 'Cotte de mailles',
    inventory: [
      { item: 'Cotte de mailles', quantity: 1 },
      { item: 'Épée double', quantity: 1 },
      { item: 'Sceau du Néant', quantity: 1 },
    ],
    biography:
      'Ancien second du capitaine Atom, Morgal a trahi l’équipage du Vent d’Éther pour servir le Néant.',
    personality: 'Charismatique, rancunier et convaincu que le ciel appartient aux plus forts.',
    secrets: 'Il a ordonné le massacre de la compagnie de Goor pour s’emparer de la forteresse.',
    gmNotes: 'S’il tombe sous la moitié de ses PV, il tente de fuir sur une chaloupe.',
  },
  {
    key: 'archon',
    name: 'L’Archonte du Néant',
    type: 'MONSTER',
    occupation: 'Entité du vide',
    level: 15,
    xp: 155000,
    isUnique: true,
    isBoss: true,
    alignment: 'NEUTRAL_EVIL',
    stats: {
      strength: 16,
      dexterity: 18,
      constitution: 20,
      intelligence: 22,
      wisdom: 18,
      charisma: 20,
    },
    maxHp: 260,
    attitude: 'HOSTILE',
    status: 'WAITING',
    extraAbilities: ['Rayon du vide'],
    biography:
      'Une conscience née du vide sous les îles. Elle veut faire tomber l’archipel pour l’engloutir.',
    gmNotes: 'Invulnérable tant que l’astrolabe de cristal n’a pas révélé son véritable nom.',
  },
];

export const ARCHIPEL_CHAPTERS: ChapterSpec[] = [
  {
    position: 2,
    title: 'L’île d’Ilmar',
    status: 'COMPLETED',
    sessions: ['2026-10-03'],
    narration: [
      'Le Vent d’Éther accoste au bord d’une île couverte de bosquets suspendus. Les racines pendent dans le vide comme des cordages, mais leurs feuilles, autrefois d’un vert éclatant, ont pris la couleur de la cendre.',
      'Alira reconnaît à peine sa terre natale : un mal invisible ronge l’île de l’intérieur, et l’arbre ancien, cœur battant d’Ilmar, se meurt.',
    ],
    gmNotes: [
      'L’Ancien ne parle qu’à ceux qui ont aidé les bosquets ; laisser les héros chasser les arrawaks avant la rencontre.',
    ],
    scenes: [
      {
        key: 'grove',
        title: 'Les bosquets suspendus',
        narration: [
          'Des passerelles de lianes relient des îlots de mousse où poussent des arbres aux troncs tordus. Chaque pas fait trembler les racines au-dessus du vide.',
          'Des cris stridents résonnent : une meute d’arrawaks a fait son nid dans les branches mortes.',
        ],
        groups: [{ name: 'Ennemis', creatures: [{ key: 'arrawak', count: 3 }] }],
      },
      {
        key: 'ancient-tree',
        title: 'L’arbre ancien',
        narration: [
          'Au sommet de l’île se dresse un arbre colossal dont les branches portent les nuages. Son écorce est fendue d’une plaie noire en forme d’œil fermé.',
        ],
        groups: [{ name: 'Personnages de quête', creatures: [{ key: 'ancient' }] }],
        riddles: [
          {
            key: 'roots-song',
            title: 'Le chant des racines',
            statement:
              'Je bois sans avoir soif, je grandis sans manger, je meurs si l’on me coupe du ciel. Qui suis-je ?',
            solution: 'La sève : il faut la libérer du sceau pour sauver l’arbre.',
          },
        ],
        traps: [
          {
            name: 'Ronces du Néant',
            description:
              'Des ronces noires jaillissent de la plaie de l’arbre quand on l’approche.',
            effects: ['Ronces du Néant'],
          },
        ],
        chests: [
          {
            name: 'Offrande des druides',
            isLocked: false,
            isRevealed: true,
            content: [
              { item: 'Graine d’Ilmar', quantity: 1 },
              { item: 'Potion de soin commune', quantity: 2 },
            ],
          },
        ],
      },
    ],
  },
  {
    position: 3,
    title: 'Le port de Brisevent',
    status: 'COMPLETED',
    sessions: ['2026-10-17', '2026-10-31'],
    narration: [
      'Brisevent est un port accroché à flanc de falaise, où des centaines de navires volants s’amarrent à des pontons de bois suspendus. On y trouve de tout, surtout ce qui ne devrait pas s’y trouver.',
      'Sélène connaît chaque ruelle : c’est ici que les pirates du Néant recrutent, et ici que sa famille a contracté sa dette.',
    ],
    gmNotes: [
      'Orsa ment sur tout sauf sur les prix. Un test de Perspicacité réussi révèle qu’elle connaît Morgal.',
    ],
    scenes: [
      {
        key: 'docks',
        title: 'Les quais célestes',
        narration: [
          'Les pontons grincent sous les caisses de marchandises. Des débardeurs hurlent des ordres, des mouettes des nuages tournoient au-dessus des mâts.',
          'Un navire sans pavillon est amarré à l’écart ; ses marins portent tous un disque noir au cou.',
        ],
        groups: [
          { name: 'Gardes', creatures: [{ key: 'guard', count: 2 }] },
          { name: 'Ennemis', creatures: [{ key: 'pirate', count: 3, isRevealed: false }] },
        ],
      },
      {
        key: 'tavern',
        title: 'La taverne du Vent Tordu',
        narration: [
          'Une salle basse enfumée où l’on boit de l’hydromel tiède sous des lanternes en forme de poissons. Dame Orsa trône derrière son comptoir, un registre ouvert devant elle.',
        ],
        groups: [{ name: 'Commerce', creatures: [{ key: 'orsa' }] }],
        chests: [
          {
            key: 'fence-chest',
            name: 'Coffre du receleur',
            isLocked: true,
            isRevealed: false,
            content: [
              { item: 'Carte des courants', quantity: 1 },
              { item: 'Pièces d’or', quantity: 240 },
              { item: 'Anneau d’invisibilité', quantity: 1 },
            ],
          },
        ],
      },
    ],
  },
  {
    position: 4,
    title: 'Les ruines de l’observatoire',
    status: 'IN_PROGRESS',
    sessions: ['2026-11-14'],
    currentScene: 'astrolabes',
    narration: [
      'Grâce à la carte des courants, le Vent d’Éther atteint une île oubliée de toutes les routes : un ancien observatoire y domine les nuages, à moitié effondré.',
      'On dit que ses astronomes avaient prédit l’arrivée du Néant. Personne n’est revenu pour le confirmer.',
    ],
    gmNotes: [
      'Les héros se sont arrêtés à l’entrée de la salle des astrolabes, Lysandre vient de leur ouvrir la porte.',
      'Les spectres ne se manifestent que si une lanterne est allumée.',
    ],
    scenes: [
      {
        key: 'stairs',
        title: 'Le grand escalier',
        isPlayed: true,
        narration: [
          'Un escalier de marbre blanc s’enroule autour de la tour. Des statues de gardiens, figées dans une posture de salut, bordent chaque palier.',
        ],
        groups: [{ name: 'Ennemis', creatures: [{ key: 'golem', count: 2 }] }],
        traps: [
          {
            name: 'Marches effondrées',
            description: 'Une volée de marches s’écroule sous le premier qui s’y aventure.',
            effects: ['Éboulement'],
          },
        ],
      },
      {
        key: 'astrolabes',
        title: 'La salle des astrolabes',
        isPlayed: true,
        narration: [
          'Sous une coupole fendue, des dizaines d’astrolabes de cuivre tournent encore lentement, mus par un mécanisme invisible. La lumière des étoiles filtre à travers les fissures.',
        ],
        groups: [
          { name: 'Personnages de quête', creatures: [{ key: 'lysandre' }] },
          {
            name: 'Ennemis',
            creatures: [{ key: 'specter', count: 3, isRevealed: false, status: 'WAITING' }],
          },
        ],
        riddles: [
          {
            key: 'stars-alignment',
            title: 'L’alignement des astres',
            statement:
              'Trois étoiles guident le voyageur : celle qui ne bouge jamais, celle qui se lève la première et celle qui meurt la dernière.',
            solution:
              'L’étoile polaire, l’étoile du berger et l’étoile du soir : alignées, elles révèlent la position de la forteresse.',
          },
        ],
        chests: [
          {
            key: 'crystal-chest',
            name: 'Écrin de l’astronome',
            isLocked: true,
            isRevealed: false,
            content: [
              { item: 'Astrolabe de cristal', quantity: 1 },
              { item: 'Potion de mana commune', quantity: 2 },
            ],
          },
        ],
      },
    ],
  },
  {
    position: 5,
    title: 'La forteresse des Crocs de Fer',
    status: 'NEW',
    narration: [
      'L’astrolabe désigne une île de roche noire hérissée de tours : l’ancienne forteresse des Crocs de Fer, abandonnée depuis le massacre de la compagnie de Goor.',
      'Sur la porte principale, une empreinte ronde attend une clé que Goor porte au cou depuis des années sans le savoir.',
    ],
    gmNotes: ['Moment fort pour Goor : lui laisser découvrir la vérité sur le massacre.'],
    scenes: [
      {
        key: 'sealed-gate',
        title: 'La porte scellée',
        narration: [
          'Une porte de fer haute de dix mètres, couverte de crocs gravés. Au centre, une empreinte ronde de la taille d’un médaillon.',
        ],
        riddles: [
          {
            title: 'Le serment des Crocs',
            statement:
              'Gravé sous l’empreinte : « Celui qui revient n’entre pas en vainqueur, mais en témoin. »',
            solution: 'Goor doit poser le médaillon et prononcer le nom de son capitaine.',
          },
        ],
      },
      {
        key: 'armory',
        title: 'La salle d’armes',
        narration: [
          'Des râteliers renversés, des boucliers fendus et, sur le mur du fond, les noms de tous les soldats tombés, gravés à la hâte.',
        ],
        groups: [{ name: 'Ennemis', creatures: [{ key: 'specter', count: 2 }] }],
        traps: [
          {
            name: 'Plafond piégé',
            description: 'Un mécanisme fait tomber des blocs de pierre sur les intrus.',
            effects: ['Éboulement'],
          },
        ],
        chests: [
          {
            name: 'Coffre de la compagnie',
            isLocked: true,
            isRevealed: false,
            content: [
              { item: 'Pièces d’or', quantity: 600 },
              { item: 'Cotte de mailles', quantity: 2 },
              { item: 'Potion de soin supérieure', quantity: 2 },
            ],
          },
        ],
      },
    ],
  },
  {
    position: 6,
    title: 'La forge de l’étoile',
    status: 'NEW',
    narration: [
      'Au cœur de la forteresse, une forge éteinte depuis des années repose sur un fragment d’étoile tombée. C’est ici qu’Erwïl avait commencé sa lame, avant que les pirates ne la lui volent.',
    ],
    gmNotes: [
      'La lame d’étoile n’est pas terminée : la tremper dans le vide la rendrait plus puissante, mais corrompue.',
    ],
    scenes: [
      {
        key: 'forge',
        title: 'La forge abandonnée',
        narration: [
          'Une enclume large comme une table, des soufflets crevés et un foyer froid où brille encore une braise bleue.',
        ],
        chests: [
          {
            name: 'Établi d’Erwïl',
            isLocked: false,
            isRevealed: true,
            content: [{ item: 'Lame d’étoile', quantity: 1 }],
          },
        ],
      },
      {
        key: 'star-heart',
        title: 'Le cœur de l’étoile',
        narration: [
          'Sous la forge, une caverne illuminée par le fragment d’étoile. La chaleur y est écrasante et le métal des murs chante quand on le touche.',
        ],
        groups: [{ name: 'Ennemis', creatures: [{ key: 'golem', count: 1 }] }],
        traps: [
          {
            name: 'Éruption stellaire',
            description: 'Le fragment d’étoile libère une décharge de feu quand on le frappe.',
            effects: ['Décharge stellaire'],
          },
        ],
      },
    ],
  },
  {
    position: 7,
    title: 'La flotte du Néant',
    status: 'NEW',
    narration: [
      'La flotte pirate attend dans un banc de nuages noirs. Le navire amiral de Morgal, un trois-mâts aux voiles déchirées, tire derrière lui une traîne de brume.',
      'Pour atteindre le cœur du Néant, il faudra passer par lui.',
    ],
    gmNotes: [
      'Le capitaine Atom accepte de lancer le Vent d’Éther à l’abordage si les héros ont gagné sa confiance au chapitre 1.',
    ],
    scenes: [
      {
        key: 'pirate-ship',
        title: 'Le navire de Morgal',
        narration: [
          'Les grappins mordent la coque, les cordages sifflent et le pont pirate se couvre de silhouettes armées. Morgal attend à la barre, un sourire aux lèvres.',
        ],
        groups: [
          { name: 'Ennemis', creatures: [{ key: 'pirate', count: 6 }] },
          { name: 'Boss', creatures: [{ key: 'morgal' }] },
        ],
      },
      {
        key: 'void-hold',
        title: 'La cale du Néant',
        narration: [
          'La cale ne contient pas de marchandises mais un autel d’obsidienne, et le drake des brumes enchaîné qui s’agite dans son sommeil.',
        ],
        groups: [
          { name: 'Ennemis', creatures: [{ key: 'arrawak', count: 4 }] },
          { name: 'Boss', creatures: [{ key: 'drake', isRevealed: false }] },
        ],
        chests: [
          {
            name: 'Butin de Morgal',
            isLocked: true,
            isRevealed: false,
            content: [
              { item: 'Pièces d’or', quantity: 2000 },
              { item: 'Sceau du Néant', quantity: 1 },
              { item: 'Potion de mana supérieure', quantity: 3 },
            ],
          },
        ],
      },
    ],
  },
  {
    position: 8,
    title: 'Au-delà du vide',
    status: 'NEW',
    narration: [
      'Sous les îles, là où les nuages s’arrêtent, il n’y a plus rien. Rien, sauf un pont de brume qui descend vers un trône suspendu au-dessus du néant.',
      'L’Archonte attend. Il a attendu des siècles.',
    ],
    gmNotes: [
      'Combat final : l’astrolabe de cristal doit révéler le nom de l’Archonte pour le rendre vulnérable.',
    ],
    scenes: [
      {
        key: 'mist-bridge',
        title: 'Le pont de brume',
        narration: [
          'Un pont translucide qui se défait derrière chaque pas. Des silhouettes spectrales flottent de part et d’autre, chuchotant les noms des héros.',
        ],
        groups: [{ name: 'Ennemis', creatures: [{ key: 'specter', count: 4 }] }],
      },
      {
        key: 'void-throne',
        title: 'Le trône du Néant',
        narration: [
          'Un trône d’obsidienne flotte au milieu du vide. La silhouette qui l’occupe n’a pas de visage, seulement un œil fermé qui commence à s’ouvrir.',
        ],
        groups: [{ name: 'Boss', creatures: [{ key: 'archon' }] }],
        riddles: [
          {
            title: 'Le vrai nom',
            statement:
              'Ce qui n’a pas de nom ne peut être vaincu. Ce qui en a un peut être appelé.',
            solution:
              'L’astrolabe de cristal révèle le nom de l’Archonte : le prononcer le rend vulnérable.',
          },
        ],
      },
    ],
  },
];

export const ARCHIPEL_MAIN_OBJECTIVES: ObjectiveSpec[] = [
  {
    chapter: 2,
    label: 'Rencontrer l’Ancien d’Ilmar',
    narration: 'Le vieux druide attend les héros au pied de l’arbre ancien.',
    target: { character: 'ancient' },
  },
  {
    chapter: 2,
    label: 'Purifier l’arbre ancien',
    narration: 'Résoudre le chant des racines brise le sceau du Néant gravé dans l’écorce.',
    target: { riddle: 'roots-song' },
  },
  {
    chapter: 3,
    label: 'Débusquer les pirates sur les quais',
    narration: 'Les marins du navire sans pavillon portent tous le sceau du Néant.',
    target: { character: 'pirate' },
  },
  {
    chapter: 3,
    label: 'Récupérer la carte des courants',
    narration: 'Seule cette carte mène à l’île de l’observatoire.',
    target: { item: 'Carte des courants' },
  },
  {
    chapter: 4,
    label: 'Franchir le grand escalier',
    target: { scene: 'stairs' },
    isCompleted: true,
  },
  {
    chapter: 4,
    label: 'Déchiffrer l’alignement des astres',
    narration: 'Les astrolabes indiquent la position de la forteresse des Crocs de Fer.',
    target: { riddle: 'stars-alignment' },
  },
  {
    chapter: 5,
    label: 'Ouvrir la porte scellée avec le médaillon de Goor',
    target: { scene: 'sealed-gate' },
  },
  {
    chapter: 5,
    label: 'Découvrir la vérité sur le massacre des Crocs de Fer',
    narration: 'Les noms gravés dans la salle d’armes désignent Morgal comme le traître.',
    target: { scene: 'armory' },
  },
  {
    chapter: 5,
    label: 'Repousser les spectres de la salle d’armes',
    target: { character: 'specter' },
  },
  {
    chapter: 6,
    label: 'Rallumer la forge de l’étoile',
    narration: 'La braise bleue du foyer ne reprend vie qu’au contact du fragment d’étoile.',
    target: { scene: 'forge' },
  },
  {
    chapter: 6,
    label: 'Récupérer la lame d’étoile',
    target: { item: 'Lame d’étoile' },
  },
  {
    chapter: 7,
    label: 'Aborder le navire de Morgal',
    target: { scene: 'pirate-ship' },
  },
  {
    chapter: 7,
    label: 'Vaincre Morgal, capitaine du Néant',
    target: { character: 'morgal' },
  },
  {
    chapter: 7,
    label: 'Libérer le drake des brumes de ses chaînes',
    narration: 'Libéré du Néant, le drake peut devenir un allié pour la bataille finale.',
    target: { character: 'drake' },
  },
  {
    chapter: 8,
    label: 'Traverser le pont de brume',
    target: { scene: 'mist-bridge' },
  },
  {
    chapter: 8,
    label: 'Affronter l’Archonte du Néant',
    narration: 'Le sort de l’archipel tout entier se joue au-dessus du vide.',
    target: { character: 'archon' },
  },
];

export const ARCHIPEL_SIDE_QUESTS: QuestSpec[] = [
  {
    title: 'Les graines d’Ilmar',
    description:
      'L’Ancien confie à Alira la dernière graine de l’arbre ancien : si elle est plantée dans une terre saine, Ilmar pourra renaître.',
    type: 'SIDE',
    status: 'COMPLETED',
    isRevealed: true,
    chapter: 2,
    scene: 'ancient-tree',
    relatedCharacter: 'ancient',
    rewardXp: 100,
    objectives: [
      { label: 'Recevoir la graine d’Ilmar', target: { item: 'Graine d’Ilmar' } },
      {
        label: 'Débarrasser les bosquets des arrawaks',
        target: { character: 'arrawak' },
      },
    ],
  },
  {
    title: 'La dette de Sélène',
    description:
      'Dame Orsa accepte d’effacer la dette de la famille de Sélène si les héros lui rapportent le coffre d’un receleur concurrent.',
    type: 'SIDE',
    status: 'COMPLETED',
    isRevealed: true,
    chapter: 3,
    scene: 'tavern',
    relatedCharacter: 'orsa',
    rewardXp: 120,
    rewardGold: 50,
    objectives: [
      { label: 'Négocier avec Dame Orsa', target: { character: 'orsa' } },
      { label: 'Ouvrir le coffre du receleur', target: { chest: 'fence-chest' } },
    ],
  },
  {
    title: 'Les carnets de Lysandre',
    description:
      'L’astronome a perdu ses carnets d’observation dans la salle des astrolabes. Ils contiennent la seule description connue de l’Archonte.',
    type: 'SIDE',
    status: 'ACTIVE',
    isRevealed: true,
    chapter: 4,
    scene: 'astrolabes',
    relatedCharacter: 'lysandre',
    rewardXp: 150,
    rewardItems: [{ item: 'Potion de mana supérieure', quantity: 1 }],
    objectives: [
      {
        label: 'Accepter l’aide de Lysandre',
        target: { character: 'lysandre' },
        isCompleted: true,
      },
      { label: 'Ouvrir l’écrin de l’astronome', target: { chest: 'crystal-chest' } },
    ],
  },
  {
    title: 'La lame inachevée',
    description:
      'Erwïl retrouve enfin sa lame d’étoile, mais elle n’a jamais été trempée. Le fragment d’étoile peut l’achever… ou le vide, au prix de son âme.',
    type: 'SIDE',
    status: 'INACTIVE',
    isRevealed: false,
    chapter: 6,
    scene: 'star-heart',
    relatedCharacter: 'erwil',
    rewardXp: 200,
    objectives: [
      { label: 'Atteindre le cœur de l’étoile', target: { scene: 'star-heart' } },
      { label: 'Tremper la lame dans le fragment d’étoile', target: { item: 'Lame d’étoile' } },
    ],
  },
  {
    title: 'La revanche du capitaine Atom',
    description:
      'Le capitaine Atom veut regarder Morgal, son ancien second, dans les yeux avant qu’il ne soit jugé. Il demande aux héros de le capturer vivant.',
    type: 'SIDE',
    status: 'INACTIVE',
    isRevealed: false,
    chapter: 7,
    scene: 'pirate-ship',
    relatedCharacter: 'atom',
    rewardXp: 250,
    rewardGold: 200,
    objectives: [
      { label: 'Capturer Morgal vivant', target: { character: 'morgal' } },
      { label: 'Ramener Morgal au capitaine Atom', target: { character: 'atom' } },
    ],
  },
];
