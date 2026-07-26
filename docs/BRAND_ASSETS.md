# Actifs de marque

## Statut

Le logo décrit ici est l’identité visuelle officielle approuvée par le client
pour la Paroisse Saint-René-Goupil. Il a été importé le 25 juillet 2026 dans le
cadre de `S1-T03.5`.

Le fichier source demeure la référence de marque. Les versions de production
sont uniquement des recadrages ou des réductions sans perte de ce visuel.

## Original préservé

| Propriété          | Valeur                                                             |
| ------------------ | ------------------------------------------------------------------ |
| Nom reçu           | `ChatGPT Image Jul 25, 2026, 03_07_40 PM (2).png`                  |
| Copie de référence | `reference/brand/logo-saint-rene-goupil-original.png`              |
| Format décodé      | PNG, RGBA 8 bits, sRGB                                             |
| Dimensions         | 1536 × 1024 px                                                     |
| Poids              | 2 209 479 octets                                                   |
| Transparence       | Oui                                                                |
| Profil incorporé   | Aucun profil ICC                                                   |
| SHA-256            | `5E9FCA5349CA6B3A584B19B7D8CBEA1161E4B0FCE84AB6DC3AF9A8FC6EBAAD1E` |
| Statut             | Source officielle approuvée par le client                          |

La zone visuellement occupée, mesurée avec un seuil alpha supérieur à 8 sur
255, est approximativement `x=487–1012` et `y=167–717`. Cela représente des
marges transparentes d’environ 31,7 % à gauche, 34,0 % à droite, 16,3 % en haut
et 29,9 % en bas. Quelques pixels presque entièrement transparents sont présents
hors de cette zone; ils ne constituent pas un contour ou un effet visible.

Le fichier ne contient aucune personne ni donnée personnelle. Il présente une
arche ou fenêtre, une croix, le monogramme `SRG` et le nom
« Saint René Goupil ».

## Couleurs observées

Le visuel emploie des dégradés bourgogne et rouge profond, de l’or, du crème et
des rehauts clairs. Ces observations ne constituent pas une spécification
colorimétrique : aucune couleur n’a été extraite ou remplacée, et la palette CSS
du site ne doit pas servir à recolorer le logo.

## Versions de production

| Fichier                                       |   Dimensions |          Poids | SHA-256                                                            | Transformation                                              |
| --------------------------------------------- | -----------: | -------------: | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| `src/assets/brand/logo-saint-rene-goupil.png` | 590 × 615 px | 881 908 octets | `6DF029C970D143EA585463818380DDE0CC52F3EB5D970A90AC295287DD25B713` | Extraction `left=455`, `top=135`, `width=590`, `height=615` |
| `src/assets/brand/logo-mark-srg.png`          | 435 × 434 px | 474 755 octets | `FC8ABC01DA8538E3D75D47FAD12EEA2564AB78ED4EFFC701177537EB5F454956` | Extraction `left=549`, `top=135`, `width=435`, `height=434` |

La version complète garde environ 32 px de sécurité autour du contenu visible.
La version compacte conserve l’arche, la croix, `SRG` et le filet inférieur,
mais exclut entièrement le nom placé sous le symbole. Aucun élément n’a été
redessiné, déplacé ou reconstitué.

Les PNG de `src/assets/brand/` sont importés par `BrandLogo.astro`. Astro connaît
leurs dimensions au build, réserve leur ratio dans le HTML et demande à Sharp
des sorties PNG adaptées aux dimensions d’affichage. Les fichiers sources
restent intacts.

## Favicons

| Fichier public         |   Dimensions |          Poids | SHA-256                                                            |
| ---------------------- | -----------: | -------------: | ------------------------------------------------------------------ |
| `favicon-32x32.png`    |   32 × 32 px |   2 470 octets | `1D5C389DB15CF30831C6BFFC6A4F0C7753BDCD349709ABB0D3D46B29ADC77692` |
| `favicon-48x48.png`    |   48 × 48 px |   4 853 octets | `C306C9090118F380BB4ED22679E69E7767391F85CFE02F12D105978409B1B28D` |
| `apple-touch-icon.png` | 180 × 180 px |  47 628 octets | `B74312CEB27673A185A91FED8396C2280B446B3836C28D538D6D855D870297AB` |
| `favicon.png`          | 512 × 512 px | 353 603 octets | `2B67E89711F383E42557308EE39EE4F3898C0087CE5C971658274F9DE71449C7` |

Ces fichiers sont dans `public/` parce que le navigateur doit pouvoir les
demander à des URL prévisibles, sans import JavaScript ou transformation au
moment de la requête. Les balises du `<head>` indiquent leurs tailles; le
navigateur sélectionne l’icône adaptée à son contexte. Le logo complet n’est pas
utilisé en favicon, car son nom serait illisible à 32 ou 48 px.

## Règles d’utilisation

- Ne jamais recolorer, filtrer, redessiner ou simplifier le logo.
- Ne jamais modifier les lettres, la croix, l’arche, les contours ou les effets
  dorés.
- Ne jamais étirer le logo; conserver son ratio intrinsèque.
- Employer le monogramme dans le header desktop, sticky et mobile.
- Conserver le monogramme visible lorsque le menu mobile est ouvert.
- Employer le logo complet dans le footer, entre 152 et 192 px de largeur.
- Utiliser une ombre locale très légère sur photographie; ne jamais ajouter un
  grand rectangle blanc.
- Conserver un nom accessible sur tout lien d’accueil qui n’affiche que le
  symbole.
- Régénérer toute variante future depuis l’original préservé.

Le rendu doit être vérifié sur ivoire, blanc, bourgogne, charbon et photographie
claire ou sombre. Les couleurs internes du logo ne changent pas selon le fond;
seuls l’espacement et, sur photographie, une ombre extérieure discrète peuvent
assurer la séparation visuelle.

La validation de S1-T03.5 confirme que le monogramme reste lisible dans ces six
contextes. Le logo complet est techniquement visible sur photographie, mais son
nom perd de la netteté sur une image détaillée ou claire; il reste donc réservé à
une surface unie sombre, principalement le footer.

## Évolutions futures

- Une version SVG pourra être fournie ultérieurement par un graphiste à partir
  du fichier de création officiel. Aucune vectorisation automatique ne doit être
  utilisée.
- Une image Open Graph de 1200 × 630 px pourra combiner le logo et une
  photographie officielle dans un ticket distinct.
- Toute nouvelle variante devra documenter sa source, son usage, ses dimensions
  et son empreinte.
