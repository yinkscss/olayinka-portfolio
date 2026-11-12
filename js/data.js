/* =============================================================
   data.js — the CONTENT of the site, kept separate from the logic.
   main.js reads these arrays and builds the Projects cards and
   the Experience stepper with DOM methods. To add a project I
   only add an object here; no HTML needs to change.
   ============================================================= */

/**
 * PROJECTS
 * Each project is an object. "categories" is an array so one
 * project can appear under more than one filter (e.g. AI + Web3).
 */
const PROJECTS = [
  {
    title: 'GoodBuildit',
    summary: 'AI app builder: describe an app in chat, the agent plans it, writes the Solidity contract and React front end, and publishes it to a goodbuildit.xyz subdomain on Celo.',
    role: 'Founder & lead engineer',
    stack: ['TypeScript', 'Solidity', 'viem', 'Celo'],
    categories: ['ai', 'web3'],
    links: [
      { label: 'Live site', url: 'https://goodbuildit.xyz' },
      { label: 'Code', url: 'https://github.com/yinkscss/goodbuild' }
    ]
  },
  {
    title: 'StellarRoute',
    summary: 'Open-source DEX aggregation engine and UI that finds best-price routes across the Stellar DEX orderbook and Soroban AMM pools.',
    role: 'Maintainer',
    stack: ['Rust', 'TypeScript', 'Stellar', 'Soroban'],
    categories: ['web3', 'open-source'],
    links: [{ label: 'Code', url: 'https://github.com/StellarRoute/StellarRoute' }]
  },
  {
    title: 'Deepscene',
    summary: 'Production AI studio that takes a client brief through story, cast, stills and finished video, with a plain-language run view of what is working, waiting or stuck.',
    role: 'Senior AI engineer',
    stack: ['TypeScript', 'Postgres', 'Clerk', 'OpenRouter'],
    categories: ['ai'],
    links: [{ label: 'Live site', url: 'https://deepscene.vercel.app' }]
  },
  {
    title: 'Ivinex AI CRM agents',
    summary: 'LangGraph agent system for a multi-tenant CRM: intent routing, tool calls against client records, Weaviate knowledge paths, memory and streaming.',
    role: 'AI engineer',
    stack: ['Python', 'LangGraph', 'Weaviate'],
    categories: ['ai'],
    links: [] // client work under NDA: no public link
  },
  {
    title: 'AskPamelaAI engine',
    summary: 'Greenfield LangGraph engine with a centralised RAG layer (Pinecone) for legal drafting and tax Q&A, with citations and confidence handling.',
    role: 'AI engineer (contract)',
    stack: ['FastAPI', 'LangGraph', 'Pinecone', 'Docker'],
    categories: ['ai'],
    links: []
  },
  {
    title: 'Trick Shot',
    summary: 'A precision chain-hoop arcade game on Celo, playable in the browser.',
    role: 'Builder',
    stack: ['TypeScript', 'Canvas', 'Celo'],
    categories: ['games', 'web3'],
    links: [
      { label: 'Play', url: 'https://trickshot-roan.vercel.app' },
      { label: 'Code', url: 'https://github.com/yinkscss/trickshot' }
    ]
  },
  {
    title: 'Block Drop',
    summary: 'A play-to-earn block-placement puzzle on Celo.',
    role: 'Builder',
    stack: ['TypeScript', 'Celo'],
    categories: ['games', 'web3'],
    links: [
      { label: 'Play', url: 'https://beatlane.vercel.app' },
      { label: 'Code', url: 'https://github.com/yinkscss/Beatlane' }
    ]
  },
  {
    title: 'This portfolio',
    summary: 'The site you are reading: hand-written HTML, CSS and vanilla JavaScript with canvas art, custom media players and a validated contact form.',
    role: 'Designer & developer',
    stack: ['HTML', 'CSS', 'JavaScript'],
    categories: ['open-source'],
    links: [{ label: 'Code', url: 'https://github.com/yinkscss/olayinka-portfolio' }]
  }
];

/**
 * EXPERIENCE
 * Rendered as an interactive stepper (dots on a line). Order = newest first.
 */
const EXPERIENCE = [
  {
    short: 'Deepscene',
    role: 'Senior AI Engineer',
    company: 'Deepscene — production AI studio',
    period: 'Aug 2026 – Present',
    points: [
      'Built the automation that takes a brief through story, cast, stills and finished video.',
      'Connected Clerk, OpenRouter, Seedance, Postgres and object storage so each step hands off to the next.'
    ],
    stack: 'TypeScript · Postgres · OpenRouter'
  },
  {
    short: 'GoodBuildit',
    role: 'Founder & Lead Engineer',
    company: 'GoodBuildit — AI app builder on Celo',
    period: 'Nov 2026 – Present',
    points: [
      'Chat-to-app builder that writes the Solidity contract and React front end, then publishes it.',
      'Wallet-signed deploys through one viem client, so the platform never holds keys.'
    ],
    stack: 'Solidity · viem · Celo'
  },
  {
    short: 'AskPamelaAI',
    role: 'AI Engineer (Contract)',
    company: 'AskPamelaAI — greenfield AI engine',
    period: 'May 2026 – Present',
    points: [
      'Stood up the LangGraph engine: FastAPI, supervisor routing, checkpointer threads, Docker/Render deploy.',
      'Built a RAG layer on Pinecone for legal drafting and tax Q&A, gated by golden evals and pytest.'
    ],
    stack: 'FastAPI · LangGraph · Pinecone'
  },
  {
    short: 'Ivinex',
    role: 'AI Engineer',
    company: 'Ivinex LLC — multi-tenant AI CRM',
    period: 'Nov 2025 – Present',
    points: [
      'Architected production LangGraph agents: intent routing, tool calls, structured outputs, streaming.',
      'Triaged live failures from logs and tool traces, then re-verified fixes with query suites.'
    ],
    stack: 'Python · LangGraph · Weaviate'
  },
  {
    short: 'Daygent',
    role: 'AI Engineer (Contract)',
    company: 'Daygent AI — mobile productivity',
    period: 'Jan 2026 – May 2026',
    points: [
      'Built the canonical AI service for coach chat, planning, goals and focus in one tool-gated workflow.'
    ],
    stack: 'FastAPI · LangGraph'
  },
  {
    short: 'Baaba.ng',
    role: 'Lead AI Engineer (Founder, CTO)',
    company: 'Baaba.ng',
    period: 'Jan 2025 – Present',
    points: [
      'Owned greenfield AI infrastructure and shipped a RAG system for student legal-advice support.'
    ],
    stack: 'RAG · Python'
  }
];

/** Words the hero rotates through ("…turn messy work into ___"). */
const ROLES = ['agent workflows', 'RAG systems', 'on-chain apps', 'automations', 'clear run views'];

/** Lines the hero terminal types out, one after another, forever. */
const TERMINAL_LINES = [
  '> olayinka.build({ idea: "CRM agent" })',
  '< { plan: "route → tools → answer" }',
  '> olayinka.ship("goodbuildit.xyz")',
  '< { network: "celo", status: "live" }',
  '> olayinka.debug(trace)',
  '< { cause: "tool contract", fixed: true }'
];
