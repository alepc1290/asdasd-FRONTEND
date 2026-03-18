import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────── */
const CONTACT_INFO = [
  {
    icon: MapPin,
    label: "Dirección",
    value: "General Paz 576",
    sub: "Rolling Code",
  },
  {
    icon: Phone,
    label: "Teléfono",
    value: "+5493813657948",
    sub: "WhatsApp disponible",
  },
  {
    icon: Mail,
    label: "Email",
    value: "gestiondecanchaproyecto@gmail.com",
    sub: "Respondemos en menos de 24 hs",
  },
  {
    icon: Clock,
    label: "Horario de atención",
    value: "Lunes a Domingo",
    sub: "08:00 – 23:00 hs",
  },
];

const MOTIVOS = [
  "Consulta general",
  "Reserva de cancha",
  "Problema con una reserva",
  "Alquiler para eventos",
  "Presupuesto corporativo",
  "Otro",
];

const INITIAL = {
  nombre: "",
  email: "",
  telefono: "",
  motivo: "",
  mensaje: "",
};

/* ─── Form field components ─────────────────────────────── */
function Label({ children, required }) {
  return (
    <label className="block font-mono text-xs uppercase tracking-widest text-white-300 mb-2">
      {children}
      {required && <span className="text-verde-500 ml-1">*</span>}
    </label>
  );
}

function Input({ error, ...props }) {
  return (
    <>
      <input
        {...props}
        className={`input-field ${error ? "border-red-500 focus:border-red-400" : ""}`}
      />
      {error && (
        <p className="mt-1 font-mono text-xs text-red-400 flex items-center gap-1">
          <AlertCircle size={10} /> {error}
        </p>
      )}
    </>
  );
}

function Textarea({ error, ...props }) {
  return (
    <>
      <textarea
        {...props}
        rows={5}
        className={`input-field resize-none ${error ? "border-red-500 focus:border-red-400" : ""}`}
      />
      {error && (
        <p className="mt-1 font-mono text-xs text-red-400 flex items-center gap-1">
          <AlertCircle size={10} /> {error}
        </p>
      )}
    </>
  );
}

function Select({ error, children, ...props }) {
  return (
    <>
      <div className="relative">
        <select
          {...props}
          className={`input-field appearance-none pr-10 cursor-pointer ${
            error ? "border-red-500 focus:border-red-400" : ""
          }`}
        >
          {children}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-carbon-300 pointer-events-none"
        />
      </div>
      {error && (
        <p className="mt-1 font-mono text-xs text-red-400 flex items-center gap-1">
          <AlertCircle size={10} /> {error}
        </p>
      )}
    </>
  );
}

/* ─── Validate ──────────────────────────────────────────── */
function validate(fields) {
  const errs = {};
  if (!fields.nombre.trim()) errs.nombre = "El nombre es requerido";
  if (!fields.email.trim()) errs.email = "El email es requerido";
  else if (!/\S+@\S+\.\S+/.test(fields.email)) errs.email = "Email inválido";
  if (!fields.motivo) errs.motivo = "Seleccioná un motivo";
  if (!fields.mensaje.trim()) errs.mensaje = "El mensaje es requerido";
  else if (fields.mensaje.trim().length < 10)
    errs.mensaje = "Mínimo 10 caracteres";
  return errs;
}

/* ─── Page ──────────────────────────────────────────────── */
export default function ContactoPage() {
  const [fields, setFields] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [touched, setTouched] = useState({});

  const set = (key) => (e) => {
    setFields((prev) => ({ ...prev, [key]: e.target.value }));
    if (touched[key]) {
      const errs = validate({ ...fields, [key]: e.target.value });
      setErrors((prev) => ({ ...prev, [key]: errs[key] }));
    }
  };

  const blur = (key) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const errs = validate(fields);
    setErrors((prev) => ({ ...prev, [key]: errs[key] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length) {
      setErrors(errs);
      setTouched({ nombre: true, email: true, motivo: true, mensaje: true });
      return;
    }

    setStatus("loading");
    // Simulate async send
    setTimeout(() => {
      setStatus("success");
      setFields(INITIAL);
      setErrors({});
      setTouched({});
    }, 1400);
  };

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden border-b border-carbon-700">
        <div className="absolute inset-0 bg-gradient-to-br from-carbon-900 via-carbon-800 to-carbon-900" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-verde-500/50 to-transparent" />
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-verde-500/20 to-transparent hidden lg:block" />

        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,197,94,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4">
          <p
            className="section-label mb-4 animate-fade-up opacity-0"
            style={{ animationFillMode: "forwards" }}
          >
            — Estamos para ayudarte
          </p>
          <h1
            className="font-display font-900 text-white uppercase leading-none text-6xl md:text-8xl mb-6 animate-fade-up opacity-0"
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            Hablemos
            <br />
            <span className="text-verde-400">del juego.</span>
          </h1>
          <p
            className="text-carbon-300 text-lg max-w-lg animate-fade-up opacity-0"
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            ¿Tenés una duda, un problema con tu reserva o querés organizar un
            evento? Completá el formulario y te respondemos en menos de 24
            horas.
          </p>
        </div>
      </section>

      {/* ── BODY ──────────────────────────────────────────── */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* ── Left: Contact info ──────────────────────── */}
          <aside className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <p className="section-label mb-3">Información de contacto</p>
              <h2 className="section-title text-3xl mb-2">Encontranos</h2>
            </div>

            <div className="flex flex-col gap-px bg-carbon-600">
              {CONTACT_INFO.map(({ icon: Icon, label, value, sub }) => (
                <div
                  key={label}
                  className="bg-carbon-800 hover:bg-carbon-700 transition-colors p-5 flex gap-4 items-start group"
                >
                  <div className="w-9 h-9 border border-carbon-600 group-hover:border-verde-600 flex items-center justify-center flex-shrink-0 transition-colors mt-0.5">
                    <Icon size={15} className="text-verde-500" />
                  </div>
                  <div>
                    <div className="font-mono text-verde-500 text-xs uppercase tracking-widest mb-0.5">
                      {label}
                    </div>
                    <div className="font-display font-700 text-white text-sm uppercase tracking-wide">
                      {value}
                    </div>
                    <div className="text-green-400 text-xs mt-0.5">{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick CTA */}
            <div className="border border-verde-600 p-6 mt-2">
              <p className="font-mono text-verde-500 text-xs uppercase tracking-widest mb-2">
                ¿Ya sabés lo que querés?
              </p>
              <h3 className="font-display font-800 text-white uppercase text-xl leading-tight mb-4">
                Reservá directo sin escribirnos
              </h3>
              <Link
                to="/reservar"
                className="btn-primary inline-flex items-center gap-2 text-xs"
              >
                Ir a reservar <ArrowRight size={14} />
              </Link>
            </div>
          </aside>

          {/* ── Right: Form ─────────────────────────────── */}
          <div className="lg:col-span-3">
            {status === "success" ? (
              /* ── Success state ── */
              <div className="border border-verde-600 bg-carbon-800 p-10 flex flex-col items-center text-center gap-4 animate-fade-in">
                <div className="w-14 h-14 bg-verde-500/10 border border-verde-600 flex items-center justify-center">
                  <CheckCircle size={28} className="text-verde-400" />
                </div>
                <div>
                  <h3 className="font-display font-800 text-white uppercase text-2xl mb-2">
                    ¡Mensaje enviado!
                  </h3>
                  <p className="text-carbon-300 text-sm leading-relaxed max-w-xs">
                    Recibimos tu consulta. Te respondemos en menos de 24 horas.
                  </p>
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="btn-outline text-xs mt-2"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              /* ── Form ── */
              <form onSubmit={handleSubmit} noValidate>
                <div className="border border-carbon-600 bg-carbon-800">
                  {/* Form header */}
                  <div className="px-6 py-4 border-b border-carbon-700 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-verde-500 animate-pulse-dot" />
                    <span className="font-mono text-xs text-green-300 uppercase tracking-widest">
                      Formulario de contacto
                    </span>
                  </div>

                  <div className="p-6 flex flex-col gap-6">
                    {/* Row: Nombre + Telefono */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <Label required>Nombre completo</Label>
                        <Input
                          type="text"
                          placeholder="Juan Pérez"
                          value={fields.nombre}
                          onChange={set("nombre")}
                          onBlur={blur("nombre")}
                          error={errors.nombre}
                        />
                      </div>
                      <div>
                        <Label>Teléfono</Label>
                        <Input
                          type="tel"
                          placeholder="+54 9 11 0000-0000"
                          value={fields.telefono}
                          onChange={set("telefono")}
                          onBlur={blur("telefono")}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <Label required>Email</Label>
                      <Input
                        type="email"
                        placeholder="juan@ejemplo.com"
                        value={fields.email}
                        onChange={set("email")}
                        onBlur={blur("email")}
                        error={errors.email}
                      />
                    </div>

                    {/* Motivo */}
                    <div>
                      <Label required>Motivo de contacto</Label>
                      <Select
                        value={fields.motivo}
                        onChange={set("motivo")}
                        onBlur={blur("motivo")}
                        error={errors.motivo}
                      >
                        <option value="" disabled>
                          Seleccioná una opción...
                        </option>
                        {MOTIVOS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </Select>
                    </div>

                    {/* Mensaje */}
                    <div>
                      <Label required>Mensaje</Label>
                      <Textarea
                        placeholder="Contanos en qué te podemos ayudar..."
                        value={fields.mensaje}
                        onChange={set("mensaje")}
                        onBlur={blur("mensaje")}
                        error={errors.mensaje}
                      />
                      <div className="flex justify-end mt-1">
                        <span
                          className={`font-mono text-xs ${
                            fields.mensaje.length > 400
                              ? "text-red-400"
                              : "text-carbon-500"
                          }`}
                        >
                          {fields.mensaje.length}/500
                        </span>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-between pt-2 border-t border-carbon-700 gap-4">
                      <p className="text-carbon-500 text-xs font-mono">
                        <span className="text-verde-500">*</span> Campos
                        requeridos
                      </p>
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {status === "loading" ? (
                          <>
                            <span className="w-4 h-4 border-2 border-carbon-900/30 border-t-carbon-900 rounded-full animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            Enviar mensaje <Send size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── MAP PLACEHOLDER ───────────────────────────────── */}
      <section className="border-t border-carbon-700">
        <div className="relative h-64 bg-carbon-800 overflow-hidden flex items-center justify-center">
          {/* Field SVG bg */}
          <svg
            viewBox="0 0 900 300"
            className="absolute inset-0 w-full h-full opacity-5"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.5"
          >
            <rect x="20" y="20" width="860" height="260" />
            <circle cx="450" cy="150" r="60" />
            <line x1="450" y1="20" x2="450" y2="280" />
            <rect x="20" y="95" width="70" height="110" />
            <rect x="810" y="95" width="70" height="110" />
            <rect x="20" y="120" width="25" height="60" />
            <rect x="855" y="120" width="25" height="60" />
            <circle cx="450" cy="150" r="4" fill="#22c55e" />
          </svg>

          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 border border-carbon-600 bg-carbon-900/80 px-5 py-3 mb-2">
              <MapPin size={14} className="text-verde-500" />
              <span className="font-display font-700 text-white uppercase text-sm tracking-widest">
                Av. Siempreviva 742, Springfield
              </span>
            </div>
            <p className="text-carbon-400 text-xs font-mono">
              A 5 minutos del centro · Estacionamiento disponible
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
