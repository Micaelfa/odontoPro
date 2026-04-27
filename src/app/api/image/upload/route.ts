import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

export const POST = async (request: Request) => {
  try {
    if (
      !process.env.CLOUDINARY_NAME ||
      !process.env.CLOUDINARY_KEY ||
      !process.env.CLOUDINARY_SECRET
    ) {
      return NextResponse.json(
        { error: "Credenciais do Cloudinary não configuradas." },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string | null;

    if (!userId || userId === "") {
      return NextResponse.json(
        { error: "Falha ao alterar imagem" },
        { status: 401 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { error: "Imagem não encontrada" },
        { status: 400 }
      );
    }

    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      return NextResponse.json(
        { error: "Formato errado da imagem" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "profile-avatar",
            tags: [userId],
            public_id: userId,
            overwrite: true,
            invalidate: true,
            resource_type: "image",
          },
          function (error, result) {
            if (error) {
              reject(error);
              return;
            }

            if (!result) {
              reject(new Error("Erro ao enviar imagem para o Cloudinary"));
              return;
            }

            resolve(result);
          }
        )
        .end(buffer);
    });

    return NextResponse.json({
      ok: true,
      secure_url: result.secure_url,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro interno ao enviar imagem",
        details:
          error instanceof Error ? error.message : "Erro desconhecido no upload",
      },
      { status: 500 }
    );
  }
};