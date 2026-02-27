import React, { useState } from "react";

interface FormData {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  agentes: string;
}

export default function DemoForm() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    empresa: "",
    email: "",
    telefono: "",
    agentes: "1-5 agentes",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/send-demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "¡Gracias! Nos pondremos en contacto en menos de 2 horas. 🚀",
        });
        setFormData({
          nombre: "",
          empresa: "",
          email: "",
          telefono: "",
          agentes: "1-5 agentes",
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Hubo un error al enviar el formulario",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error al conectar con el servidor",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div>
        <label className="block text-[11px] text-text-muted mb-1.5 font-mono">
          Nombre completo
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Juan García"
          required
          className="w-full bg-bg-dark border border-[rgba(0,212,255,0.15)] rounded-lg px-3.5 py-2.5 text-text-base font-body text-[13px] transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)] placeholder:text-text-dim"
        />
      </div>

      <div>
        <label className="block text-[11px] text-text-muted mb-1.5 font-mono">Empresa</label>
        <input
          type="text"
          name="empresa"
          value={formData.empresa}
          onChange={handleChange}
          placeholder="Mi Empresa SA"
          required
          className="w-full bg-bg-dark border border-[rgba(0,212,255,0.15)] rounded-lg px-3.5 py-2.5 text-text-base font-body text-[13px] transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)] placeholder:text-text-dim"
        />
      </div>

      <div>
        <label className="block text-[11px] text-text-muted mb-1.5 font-mono">
          Email corporativo
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="juan@empresa.com"
          required
          className="w-full bg-bg-dark border border-[rgba(0,212,255,0.15)] rounded-lg px-3.5 py-2.5 text-text-base font-body text-[13px] transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)] placeholder:text-text-dim"
        />
      </div>

      <div>
        <label className="block text-[11px] text-text-muted mb-1.5 font-mono">Teléfono</label>
        <input
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="+1 555 0000"
          required
          className="w-full bg-bg-dark border border-[rgba(0,212,255,0.15)] rounded-lg px-3.5 py-2.5 text-text-base font-body text-[13px] transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)] placeholder:text-text-dim"
        />
      </div>

      <div className="mb-5">
        <label className="block text-[11px] text-text-muted mb-1.5 font-mono">
          ¿Cuántos agentes tiene tu equipo?
        </label>
        <select
          name="agentes"
          value={formData.agentes}
          onChange={handleChange}
          className="w-full bg-bg-dark border border-[rgba(0,212,255,0.15)] rounded-lg px-3.5 py-2.5 text-text-base font-body text-[13px] transition-all focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)]"
        >
          <option>1-5 agentes</option>
          <option>6-20 agentes</option>
          <option>21-50 agentes</option>
          <option>50+ agentes</option>
        </select>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-[13px] text-center ${
            message.type === "success"
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary-glow w-full flex items-center justify-center gap-2.5 bg-gradient-to-br from-primary to-secondary text-white font-bold text-[15px] px-8 py-[15px] rounded-full border-none cursor-pointer shadow-glow-primary disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        <span className="relative z-10">
          {loading ? "⏳ Enviando..." : "🚀 Solicitar Demo Gratuita"}
        </span>
      </button>

      <p className="text-center text-[11px] text-text-dim mt-2.5">
        Sin spam. Aceptas nuestra Política de Privacidad.
      </p>
    </form>
  );
}
