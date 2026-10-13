import React, { useState } from 'react';
import { User } from 'lucide-react';

interface ResidentAvatarProps {
  name?: string;
  block?: string;
  apartmentNumber?: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ResidentAvatar: React.FC<ResidentAvatarProps> = ({
  name,
  block,
  apartmentNumber,
  avatarUrl,
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses: Record<string, string> = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs',
    lg: 'w-14 h-14 text-sm',
    xl: 'w-20 h-20 text-base',
  };

  const getInitials = () => {
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return parts[0].substring(0, 2).toUpperCase();
    }
    if (block && apartmentNumber) {
      return `${block}${apartmentNumber}`;
    }
    return '';
  };

  const isBlockB = block === 'B';

  if (avatarUrl && !imgError) {
    return (
      <div
        className={`relative rounded-full overflow-hidden shrink-0 bg-[#E8ECF4] border border-[#D5DCE8] ${sizeClasses[size]} ${className}`}
      >
        <img
          src={avatarUrl}
          alt={name || `Apto ${block}-${apartmentNumber}`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const initials = getInitials();

  return (
    <div
      className={`rounded-full shrink-0 flex items-center justify-center font-semibold tracking-tight select-none border ${
        isBlockB
          ? 'bg-[#F5E6E3] text-[#9E4738] border-[#E5C9C3]'
          : 'bg-[#E5EBF5] text-[#3B5284] border-[#CBD6EA]'
      } ${sizeClasses[size]} ${className}`}
    >
      {initials ? (
        <span>{initials}</span>
      ) : (
        <User className="w-1/2 h-1/2 opacity-75" />
      )}
    </div>
  );
};

export function processUploadedAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 256;
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        canvas.width = maxDim;
        canvas.height = maxDim;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, maxDim, maxDim);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => resolve(result);
      img.src = result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
