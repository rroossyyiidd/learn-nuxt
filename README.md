# 💿 CD Rental Admin Panel

An admin panel application for managing CD/Film rentals, built with **Nuxt 4** and **Vuetify 3**. Features film catalog management, customer records, rental transactions, and **TMDB API** integration for film search.

## ✨ Features

- **Dashboard** — Catalog statistics overview: total films, genres, stock, average rating, genre distribution, and recent films
- **Film Catalog** — Full CRUD with TMDB search integration, auto-filled posters, and genre filtering
- **Customer Management** — CRUD for customer data with membership tiers (Silver / Gold / Platinum)
- **Rental Management** — CRUD for rental transactions with multi-item support and status tracking (Aktif / Selesai / Terlambat)
- **Authentication** — Login/logout with cookie-based sessions and global route guard
- **Dark / Light Mode** — Theme toggle with localStorage-persisted preference

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Nuxt 4](https://nuxt.com/) + [Vue 3](https://vuejs.org/) |
| UI Framework | [Vuetify 3](https://vuetifyjs.com/) via `vuetify-nuxt-module` |
| State / Fetching | [TanStack Query](https://tanstack.com/query) via `@peterbud/nuxt-query` |
| Validation | [Zod 4](https://zod.dev/) |
| Styling | SCSS (via `sass-embedded`) |
| Icons | [Material Design Icons](https://materialdesignicons.com/) (`@mdi/font`) |
| External API | [TMDB API](https://developer.themoviedb.org/) (film search & genres) |

## 📁 Project Structure

```
learn-nuxt-dot/
├── app/
│   ├── app.vue                    # Root component
│   ├── assets/
│   │   └── vuetify-layer-order.css  # CSS layer ordering for Vuetify
│   ├── composables/               # Custom composables (auto-imported)
│   │   ├── auth/
│   │   │   └── useAuth.ts           # Login, logout, fetch user
│   │   ├── catalog/
│   │   │   ├── useCatalog.ts        # Film list query
│   │   │   ├── useCatalogFilm.ts    # Single film detail query
│   │   │   └── useCatalogStats.ts   # Catalog statistics query
│   │   ├── pelanggan/
│   │   │   ├── usePelanggan.ts      # Customer list query
│   │   │   └── usePelangganDetail.ts
│   │   ├── sewa/
│   │   │   ├── useSewa.ts           # Rental list query
│   │   │   └── useSewaDetail.ts
│   │   └── tmdb/
│   │       ├── useTmdbSearch.ts     # TMDB film search query
│   │       └── useTmdbGenres.ts     # TMDB genre list query
│   ├── layouts/
│   │   ├── default.vue            # Main layout (sidebar + app bar)
│   │   └── auth.vue               # Login page layout
│   ├── middleware/
│   │   └── auth.global.ts         # Route guard: redirects to /login if unauthenticated
│   ├── pages/
│   │   ├── index.vue              # Dashboard
│   │   ├── login.vue              # Login page
│   │   ├── catalog/
│   │   │   ├── index.vue            # Film list with search/filter
│   │   │   ├── add.vue              # Add film (+ TMDB search)
│   │   │   └── [id].vue            # Edit film
│   │   ├── pelanggan/
│   │   │   ├── index.vue            # Customer list
│   │   │   ├── add.vue              # Add customer
│   │   │   └── [id].vue            # Edit customer
│   │   └── sewa/
│   │       ├── index.vue            # Rental list
│   │       ├── add.vue              # Add rental
│   │       └── [id].vue            # Edit rental
│   ├── plugins/
│   │   └── theme.client.ts        # Restores theme preference from localStorage
│   └── types/                     # TypeScript type definitions (auto-imported)
│       ├── auth.ts                  # TUser, TLoginResponse, TMeResponse
│       ├── film.ts                  # TFilm, TCatalogResponse, TCatalogStats
│       ├── genre.ts                 # EAvailableGenre enum
│       ├── pelanggan.ts             # TPelanggan, TPelangganResponse
│       ├── sewa.ts                  # TSewa, TSewaItem, TSewaResponse
│       └── tmdb.ts                  # TTmdbMovie, TTmdbSearchResponse
├── server/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.post.ts        # POST /api/auth/login
│   │   │   ├── logout.post.ts       # POST /api/auth/logout
│   │   │   └── me.get.ts            # GET  /api/auth/me
│   │   ├── catalog/
│   │   │   ├── index.get.ts         # GET  /api/catalog
│   │   │   ├── index.post.ts        # POST /api/catalog
│   │   │   ├── [id].get.ts          # GET  /api/catalog/:id
│   │   │   ├── [id].put.ts          # PUT  /api/catalog/:id
│   │   │   ├── [id].delete.ts       # DEL  /api/catalog/:id
│   │   │   └── stats.get.ts         # GET  /api/catalog/stats
│   │   ├── pelanggan/
│   │   │   ├── index.get.ts         # GET  /api/pelanggan
│   │   │   ├── index.post.ts        # POST /api/pelanggan
│   │   │   ├── [id].get.ts          # GET  /api/pelanggan/:id
│   │   │   ├── [id].put.ts          # PUT  /api/pelanggan/:id
│   │   │   └── [id].delete.ts       # DEL  /api/pelanggan/:id
│   │   ├── sewa/
│   │   │   ├── index.get.ts         # GET  /api/sewa
│   │   │   ├── index.post.ts        # POST /api/sewa
│   │   │   ├── [id].get.ts          # GET  /api/sewa/:id
│   │   │   ├── [id].put.ts          # PUT  /api/sewa/:id
│   │   │   └── [id].delete.ts       # DEL  /api/sewa/:id
│   │   └── tmdb/
│   │       ├── search.get.ts        # GET  /api/tmdb/search?query=...
│   │       ├── genres.get.ts        # GET  /api/tmdb/genres
│   │       └── [id].get.ts          # GET  /api/tmdb/:id
│   └── utils/                     # Server-side data layer (in-memory storage)
│       ├── catalog.ts               # Film CRUD + stats functions
│       ├── pelanggan.ts             # Customer CRUD functions
│       ├── sewa.ts                  # Rental CRUD functions
│       └── tmdb-types.ts            # TMDB API type definitions
├── shared/
│   └── utils/
│       └── schema.ts             # Zod validation schemas (shared between client & server)
├── nuxt.config.ts                 # Nuxt config, Vuetify theme, runtime config
├── package.json
└── tsconfig.json
```

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Login with username & password |
| `POST` | `/api/auth/logout` | Logout (clears cookie) |
| `GET` | `/api/auth/me` | Get current user from session cookie |

### Catalog (Films)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/catalog` | List all films |
| `POST` | `/api/catalog` | Add a new film |
| `GET` | `/api/catalog/stats` | Catalog statistics (totals, avg rating, genre distribution) |
| `GET` | `/api/catalog/:id` | Get film by ID |
| `PUT` | `/api/catalog/:id` | Update a film |
| `DELETE` | `/api/catalog/:id` | Delete a film |

### Pelanggan (Customers)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/pelanggan` | List all customers |
| `POST` | `/api/pelanggan` | Add a new customer |
| `GET` | `/api/pelanggan/:id` | Get customer by ID |
| `PUT` | `/api/pelanggan/:id` | Update a customer |
| `DELETE` | `/api/pelanggan/:id` | Delete a customer |

### Sewa (Rentals)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/sewa` | List all rental transactions |
| `POST` | `/api/sewa` | Create a new rental |
| `GET` | `/api/sewa/:id` | Get rental by ID |
| `PUT` | `/api/sewa/:id` | Update a rental |
| `DELETE` | `/api/sewa/:id` | Delete a rental |

### TMDB (External)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tmdb/search?query=...` | Search films on TMDB |
| `GET` | `/api/tmdb/genres` | Get genre list from TMDB |
| `GET` | `/api/tmdb/:id` | Get film details from TMDB |

## 📦 Validation Schemas

All Zod validation schemas are defined in `shared/utils/schema.ts` and shared across client and server:

- **`filmSchema`** — title, overview, releaseDate, genres, rating (0–10), stock, rentalPrice, posterPath, tmdbId
- **`pelangganSchema`** — name, email, phone, address, membershipType (Silver/Gold/Platinum), isActive
- **`sewaSchema`** — pelangganId, pelangganName, items (array of sewaItemSchema), totalPrice, status, rentalDate
- **`loginSchema`** — username, password

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** (or pnpm / yarn / bun)

### Environment Variables

Create a `.env` file in the project root:

```env
# TMDB API Token (https://developer.themoviedb.org/)
TMDB_TOKEN=your_tmdb_bearer_token

# Supabase (optional)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
```

### Install Dependencies

```bash
npm install
```

### Development Server

Start the dev server at `http://localhost:3000`:

```bash
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Theming

The app uses Vuetify 3 with custom light & dark themes. Primary color palette:

| Token | Value |
|---|---|
| Primary | `#6366F1` (Indigo) |
| Secondary | `#8B5CF6` (Violet) |
| Accent | `#F59E0B` (Amber) |
| Success | `#10B981` (Emerald) |
| Error | `#EF4444` (Red) |

Theme toggle is available in the app bar. Preference is persisted to `localStorage` and restored via the `theme.client.ts` plugin.

## 📝 Notes

- **Data Storage** — The server uses **in-memory storage**; all data resets on server restart. Designed for development and learning purposes.
- **Authentication** — Uses hardcoded credentials with cookie-based sessions. Not intended for production use.
- **TMDB Integration** — The "Add Film" page fetches film data from TMDB API (poster, overview, genres, rating) to auto-fill the form.
