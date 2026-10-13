import React, { useState, useRef, useMemo } from 'react';
import { Camera, ArrowRight, Building2 } from 'lucide-react';
import { BlockType, ResidentProfile } from '../types';
import { BUILDING_FACADE_IMAGE, generateApartmentList } from '../data/initialData';
import { ResidentAvatar, processUploadedAvatar } from './ResidentAvatar';

interface LoginPageProps {
  residents: Record<string, ResidentProfile>;
  currentResident: ResidentProfile;
  onLogin: (block: BlockType, apartmentNumber: string, name: string, avatarUrl?: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  residents,
  currentResident,
  onLogin,
}) => {
  const [selectedBlock, setSelectedBlock] = useState<BlockType>(currentResident.block || 'A');
  const [selectedApt, setSelectedApt] = useState<string>(currentResident.apartmentNumber || '101');
  const [imgLoadError, setImgLoadError] = useState(false);

  const unitId = `${selectedBlock}-${selectedApt}`;
  const existingProfile = residents[unitId];

  const [residentName, setResidentName] = useState<string>(
    existingProfile?.residentName || currentResident.residentName || ''
  );
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    existingProfile?.avatarUrl || currentResident.avatarUrl
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const allApartments = useMemo(() => generateApartmentList(), []);
  const blockApartments = useMemo(
    () => allApartments.filter((a) => a.block === selectedBlock),
    [allApartments, selectedBlock]
  );

  const handleUnitChange = (newBlock: BlockType, newApt: string) => {
    setSelectedBlock(newBlock);
    setSelectedApt(newApt);
    const id = `${newBlock}-${newApt}`;
    const prof = residents[id];
    setResidentName(prof?.residentName || '');
    setAvatarUrl(prof?.avatarUrl);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processUploadedAvatar(file);
      setAvatarUrl(dataUrl);
    } catch (err) {
      console.error('Erro ao carregar foto de perfil', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = residentName.trim() || `Morador ${selectedBlock}-${selectedApt}`;
    onLogin(selectedBlock, selectedApt, finalName, avatarUrl);
  };

  const featuredResidents = useMemo(() => {
    return ['A-101', 'A-304', 'B-502', 'B-1003']
      .map((id) => residents[id])
      .filter(Boolean);
  }, [residents]);

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#1E2430] flex flex-col lg:flex-row items-stretch">
      {/* Left Column: Full-Height Building Facade Showcase */}
      <div className="relative lg:w-7/12 min-h-[380px] lg:min-h-screen overflow-hidden bg-[#24324F] flex flex-col justify-between">
        {!imgLoadError ? (
          <img
            src={BUILDING_FACADE_IMAGE}
            alt="Fachada do Condomínio Residencial Parque das Torres"
            referrerPolicy="no-referrer"
            onError={() => setImgLoadError(true)}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2B3C60] via-[#4A6294] to-[#9E4738] flex items-center justify-center">
            <Building2 className="w-24 h-24 text-white/20" />
          </div>
        )}

        {/* Measured Contrast Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141C2B]/95 via-[#141C2B]/40 to-[#141C2B]/20" />

        {/* Top Architectural Bar */}
        <div className="relative z-10 p-6 sm:p-10 flex items-center justify-between text-white/90 text-xs tracking-wide">
          <span className="font-display font-semibold text-sm text-white">
            Residencial Parque das Torres
          </span>
          <span className="tabular-nums">Blocos A & B · 96 Unidades</span>
        </div>

        {/* Bottom Architectural Identity */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-[#D6E0F5] mb-3">
            <span>Gestão Participativa</span>
            <span aria-hidden="true">·</span>
            <span>12 Andares por Torre</span>
            <span aria-hidden="true">·</span>
            <span>1 Voto por Apartamento</span>
          </div>
          <h1
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight"
            style={{ textWrap: 'balance' }}
          >
            Decisões e prioridades do nosso condomínio em um só lugar.
          </h1>
          <p className="text-sm sm:text-base text-white/80 mt-3 leading-relaxed max-w-xl">
            Acesse com o número do seu apartamento, personalize sua foto de perfil e vote nas melhorias prioritárias para a próxima assembleia.
          </p>
        </div>
      </div>

      {/* Right Column: Chic, Uncluttered Login & Profile Access */}
      <div className="lg:w-5/12 flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16 bg-[#F7F6F2]">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <p className="text-xs font-semibold text-[#A64B3A] tracking-wide">
              Acesso do Condômino
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1E2430] mt-1 tracking-tight">
              Identifique sua unidade
            </h2>
            <p className="text-sm text-[#5C6474] mt-1">
              Escolha seu bloco e apartamento e adicione sua foto de perfil.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo Upload */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-[#E5E2DC]">
              <div className="relative group">
                <ResidentAvatar
                  name={residentName}
                  block={selectedBlock}
                  apartmentNumber={selectedApt}
                  avatarUrl={avatarUrl}
                  size="lg"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#3B5284] text-white flex items-center justify-center shadow-sm hover:bg-[#2B3C60] transition-colors"
                  title="Alterar foto de perfil"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-[#1E2430]">
                  Sua Foto de Perfil
                </div>
                <p className="text-xs text-[#687082] mt-0.5 truncate">
                  Aparece nos seus votos e propostas
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1.5 text-xs font-semibold text-[#A64B3A] hover:text-[#873829] transition-colors"
                >
                  {avatarUrl ? 'Trocar foto de perfil' : 'Enviar foto do aparelho'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Block & Apartment Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#3A4252] mb-1.5">
                  Bloco
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#EAE7E1] rounded-lg">
                  {(['A', 'B'] as BlockType[]).map((blk) => (
                    <button
                      key={blk}
                      type="button"
                      onClick={() => handleUnitChange(blk, selectedApt)}
                      className={`py-2 px-3 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                        selectedBlock === blk
                          ? 'bg-white text-[#1E2430] shadow-xs'
                          : 'text-[#5C6474] hover:text-[#1E2430]'
                      }`}
                    >
                      Bloco {blk}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-apt-select"
                  className="block text-xs font-semibold text-[#3A4252] mb-1.5"
                >
                  Apartamento (101 a 1204)
                </label>
                <select
                  id="login-apt-select"
                  value={selectedApt}
                  onChange={(e) => handleUnitChange(selectedBlock, e.target.value)}
                  className="w-full h-[38px] px-3 rounded-lg bg-white border border-[#D8D4CC] text-sm font-medium text-[#1E2430] tabular-nums focus:outline-none focus:border-[#3B5284]"
                >
                  {blockApartments.map((apt) => {
                    const res = residents[apt.id];
                    return (
                      <option key={apt.id} value={apt.apartmentNumber}>
                        Apto {apt.apartmentNumber} {res?.residentName ? `— ${res.residentName.split(' ')[0]}` : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Resident Name */}
            <div>
              <label
                htmlFor="login-resident-name"
                className="block text-xs font-semibold text-[#3A4252] mb-1.5"
              >
                Seu Nome
              </label>
              <input
                id="login-resident-name"
                type="text"
                required
                value={residentName}
                onChange={(e) => setResidentName(e.target.value)}
                placeholder="Ex: Renan Braga Vieira"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#D8D4CC] text-sm text-[#1E2430] placeholder:text-[#9AA1B0] focus:outline-none focus:border-[#3B5284]"
              />
            </div>

            {/* Submit CTA */}
            <button
              id="btn-login-enter"
              type="submit"
              className="w-full py-3 px-5 rounded-lg bg-[#A64B3A] hover:bg-[#8E3D2E] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Entrar como Bloco {selectedBlock} · Apto {selectedApt}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Switch for Pre-registered Residents */}
          <div className="mt-8 pt-6 border-t border-[#E5E2DC]">
            <p className="text-xs font-medium text-[#687082] mb-3">
              Acesso rápido de moradores cadastrados:
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {featuredResidents.map((res) => {
                const isSelected =
                  selectedBlock === res.block && selectedApt === res.apartmentNumber;
                return (
                  <button
                    key={res.id}
                    type="button"
                    onClick={() =>
                      onLogin(res.block, res.apartmentNumber, res.residentName, res.avatarUrl)
                    }
                    className={`p-2.5 rounded-lg border text-left transition-colors flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#3B5284]'
                        : 'bg-white/60 hover:bg-white border-[#E5E2DC]'
                    }`}
                  >
                    <ResidentAvatar
                      name={res.residentName}
                      block={res.block}
                      apartmentNumber={res.apartmentNumber}
                      avatarUrl={res.avatarUrl}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#1E2430] truncate">
                        {res.residentName.split(' ')[0]}
                      </div>
                      <div className="text-[11px] text-[#687082] tabular-nums">
                        Bloco {res.block} · {res.apartmentNumber}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
