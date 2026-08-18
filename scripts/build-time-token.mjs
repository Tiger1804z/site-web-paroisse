// Le jeton tel que le BUILD l'a vu — pas tel que le terminal le voit.
//
// Mesuré le 18 août 2026 sur ce dépôt : pour une variable NON préfixée
// `PUBLIC_`, la valeur écrite dans `.env` l'emporte sur celle passée dans
// l'environnement du processus. Les variables `PUBLIC_`, elles, se comportent
// à l'inverse — c'est ce qui permet à `scripts/build-public.mjs` de forcer un
// drapeau sans toucher au fichier.
//
// Un contrôle de fuite qui chercherait la mauvaise valeur passerait au vert
// sans rien avoir prouvé. Il cherche donc la valeur que le build a réellement
// compilée, en appliquant la même règle de priorité.

import { existsSync, readFileSync } from 'node:fs';
import { env, cwd } from 'node:process';

/**
 * @returns {{token: string | undefined, source: string}}
 */
export function buildTimeReadToken(root = cwd()) {
  const dotenvPath = `${root}/.env`;

  if (existsSync(dotenvPath)) {
    const [, raw] =
      readFileSync(dotenvPath, 'utf8').match(/^SANITY_API_READ_TOKEN=(.*)$/m) ??
      [];
    const value = raw?.trim().replace(/^['"]|['"]$/g, '');
    if (value) return { token: value, source: '.env' };
  }

  const fromProcess = env.SANITY_API_READ_TOKEN?.trim();
  if (fromProcess) return { token: fromProcess, source: 'process.env' };

  return { token: undefined, source: 'aucune source' };
}
