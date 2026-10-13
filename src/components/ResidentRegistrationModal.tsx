import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, CheckCircle2 } from 'lucide-react';
import { ResidentProfile, OccupancyType, TaskProposal } from '../types';
import { ResidentAvatar, processUploadedAvatar } from './ResidentAvatar';

interface ResidentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentResident: ResidentProfile;
  onSaveResident: (updatedProfile: ResidentProfile) => void;
  tasks: TaskProposal[];
}

export const ResidentRegistrationModal: React.FC<ResidentRegistrationModalProps> = ({
  isOpen,
  onClose,
  currentResident,
  onSaveResident,
}) => {
  const [formData, setFormData] = useState<ResidentProfile>(currentResident);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(currentResident);
  }, [currentResident, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processUploadedAvatar(file);
      setFormData((prev) => ({ ...prev, avatarUrl: dataUrl }));
    } catch (err) {
      console.error('Erro ao processar imagem', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ResidentProfile = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };
    onSaveResident(updated);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#141C2B]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-[#E5E2DC]">
        {/* Header */}
        <div className="bg-[#24324F] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-white">
              Meu Perfil de Morador
            </h3>
            <p className="text-xs text-white/75 tabular-nums">
              Bloco {formData.block} · Apartamento {formData.apartmentNumber}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {showSuccessToast && (
            <div className="p-3 bg-[#EBF5EE] border border-[#B8DEC4] text-[#1D5E3A] rounded-lg flex items-center gap-2 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Perfil e foto atualizados com sucesso!</span>
            </div>
          )}

          {/* Profile Photo Section */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F7F6F2] border border-[#E5E2DC]">
            <div className="relative">
              <ResidentAvatar
                name={formData.residentName}
                block={formData.block}
                apartmentNumber={formData.apartmentNumber}
                avatarUrl={formData.avatarUrl}
                size="xl"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#A64B3A] text-white flex items-center justify-center shadow-xs hover:bg-[#8E3D2E] transition-colors cursor-pointer"
                title="Escolher foto"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1">
              <div className="text-sm font-semibold text-[#1E2430]">
                Foto de Perfil
              </div>
              <p className="text-xs text-[#687082] mt-0.5">
                Sua foto identifica seus votos e propostas no condomínio.
              </p>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-[#3B5284] hover:underline underline-offset-2 cursor-pointer"
                >
                  Enviar nova foto
                </button>
                {formData.avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, avatarUrl: undefined })}
                    className="text-xs text-[#8C877E] hover:text-[#DC2626] cursor-pointer"
                  >
                    Remover
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-[#3A4252] mb-1.5">
              Seu Nome *
            </label>
            <input
              type="text"
              required
              value={formData.residentName}
              onChange={(e) => setFormData({ ...formData, residentName: e.target.value })}
              placeholder="Ex: Renan Braga Vieira"
              className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-[#D8D4CC] focus:border-[#3B5284] focus:outline-none"
            />
          </div>

          {/* Phone (optional) & Occupancy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3A4252] mb-1.5">
                WhatsApp / Telefone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 98765-4321"
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-[#D8D4CC] focus:border-[#3B5284] focus:outline-none tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3A4252] mb-1.5">
                Vínculo
              </label>
              <select
                value={formData.occupancyType}
                onChange={(e) =>
                  setFormData({ ...formData, occupancyType: e.target.value as OccupancyType })
                }
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-[#D8D4CC] focus:border-[#3B5284] focus:outline-none bg-white"
              >
                <option value="proprietario_residente">Proprietário</option>
                <option value="inquilino">Inquilino</option>
                <option value="proprietario_nao_residente">Proprietário (Locador)</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#ECE9E2] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#5C6474] hover:text-[#1E2430] rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#A64B3A] hover:bg-[#8E3D2E] text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Salvar Perfil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
