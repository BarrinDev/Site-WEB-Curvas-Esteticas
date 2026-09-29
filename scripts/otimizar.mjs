// Fotos de ./imagens → WebP em 640, 1280 e 1920 px dentro de ./imagens/otimizadas.
// A foto "recepcao" também vira ./imagens/og.jpg (1200x630), a prévia do link no WhatsApp.
// Uso: npm install e depois npm run otimizar
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { join, parse } from 'node:path';

const entrada = 'imagens';
const saida = join(entrada, 'otimizadas');
const larguras = [640, 1280, 1920];
const aceita = /\.(jpe?g|png|webp|avif|tiff?)$/i;

const slug = (nome) => nome.normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

await mkdir(saida, { recursive: true });

for (const arq of await readdir(entrada, { withFileTypes: true })) {
  if (!arq.isFile() || !aceita.test(arq.name) || arq.name === 'og.jpg') continue;
  const nome = slug(parse(arq.name).name);
  const caminho = join(entrada, arq.name);

  for (const w of larguras) {
    await sharp(caminho).rotate()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(join(saida, `${nome}-${w}.webp`));
  }
  if (nome === 'recepcao') {
    await sharp(caminho).rotate()
      .resize(1200, 630, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 85 })
      .toFile(join(entrada, 'og.jpg'));
  }
  console.log(`${arq.name} → ${nome}-{${larguras.join(',')}}.webp`);
}
