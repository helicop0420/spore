import { getSporeById, unpackToRawSporeData } from '@spore-sdk/core';
import { sporeConfig } from "@/config";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return new Response(null, { status: 400 });
  }

  try {
    const cell = await getSporeById(id, sporeConfig);
    const spore = unpackToRawSporeData(cell.data);
    const buffer = Buffer.from(spore.content.toString().slice(2), 'hex');
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': spore.contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
