"use client";

import Image from "next/image";
import { ChangeEvent, useState } from "react";
import semFoto from "@/public/foto1.png";
import { Loader, Upload } from "lucide-react";
import { toast } from "sonner";
import { updateProfileAvatar } from "../_actions/update-avatar";
import { useSession } from "next-auth/react";

interface AvatarProfileProps {
  avatarUrl: string | null;
  userId: string;
}

export function AvatarProfile({ avatarUrl, userId }: AvatarProfileProps) {
  const [previewImage, setPreviewImage] = useState(avatarUrl);
  const [loading, setLoading] = useState(false);
  const { update } = useSession();

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const image = e.target.files?.[0];

    if (!image) {
      return;
    }

    try {
      setLoading(true);

      if (image.type !== "image/jpeg" && image.type !== "image/png") {
        toast.error("Formato de imagem inválido");
        return;
      }

      const newFilename = `${userId}`;
      const newFile = new File([image], newFilename, {
        type: image.type,
      });

      const urlImage = await uploadImage(newFile);

      if (!urlImage) {
        toast.error("Falha ao alterar imagem");
        return;
      }

      const response = await updateProfileAvatar({
        avatarUrl: urlImage,
      });

      if (response.error) {
        toast.error(response.error);
        return;
      }

      setPreviewImage(urlImage);

      await update({
        image: urlImage,
      });

      toast.success("Imagem alterada com sucesso!");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  async function uploadImage(image: File): Promise<string | null> {
  try {
    toast("Estamos enviando sua imagem...");

    const formData = new FormData();

    formData.append("file", image);
    formData.append("userId", userId);

    const response = await fetch("/api/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.details || data.error || "Erro ao enviar imagem");
      return null;
    }

    if (!data.secure_url) {
      toast.error("URL da imagem não retornada pelo Cloudinary");
      return null;
    }

    return data.secure_url as string;
  } catch {
    toast.error("Erro inesperado ao enviar imagem");
    return null;
  }
}

  return (
    <div className="relative w-40 h-40 md:w-48 md:h-48">
      <div className="relative flex items-center justify-center w-full h-full">
        <span className="absolute cursor-pointer z-20 bg-slate-50/80 rounded-full shadow-xl p-2">
          {loading ? (
            <Loader size={16} color="#131313" className="animate-spin" />
          ) : (
            <Upload size={16} color="#131313" />
          )}
        </span>

        <input
          type="file"
          accept="image/png, image/jpeg"
          className="opacity-0 cursor-pointer relative z-50 w-48 h-48"
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      {previewImage ? (
        <Image
          src={previewImage}
          alt="Foto de perfil da clínica"
          fill
          className="w-full h-48 object-cover rounded-full bg-slate-200"
          quality={100}
          priority
          sizes="(max-width: 480px) 100vw, (max-width: 1024px) 75vw, 60vw"
        />
      ) : (
        <Image
          src={semFoto}
          alt="Foto de perfil da clínica"
          fill
          className="w-full h-48 object-cover rounded-full bg-slate-200"
          quality={100}
          priority
          sizes="(max-width: 480px) 100vw, (max-width: 1024px) 75vw, 60vw"
        />
      )}
    </div>
  );
}