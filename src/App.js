import React, { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "http://localhost:3000/api";
const STORAGE_KEY = "hotel-everton-session";

const MODULES = {
  hotel: {
    title: "Hotel",
    endpoint: "/hotel",
    keyField: "NIT_hotel",
    fields: [
      { name: "NIT_hotel", label: "NIT", type: "text", required: true },
      { name: "nombre", label: "Nombre", type: "text", required: true },
      { name: "direccion", label: "Direccion", type: "text", required: true },
      { name: "telefono", label: "Telefono", type: "text", required: true },
      { name: "correo_electronico", label: "Correo electronico", type: "email", required: true },
      { name: "num_empleados", label: "Numero de empleados", type: "number" },
      { name: "num_habitaciones", label: "Numero de habitaciones", type: "number" },
      { name: "num_huespedes", label: "Numero de huespedes", type: "number" },
    ],
  },
  huesped: {
    title: "Huespedes",
    endpoint: "/huesped",
    keyField: "id_huesped",
    fields: [
      { name: "nombre_huesped", label: "Nombre completo", type: "text", required: true },
      { name: "fecha_nacimiento", label: "Fecha de nacimiento", type: "date", required: true },
      { name: "telefono", label: "Telefono", type: "text", required: true },
      { name: "direccion", label: "Direccion", type: "text", required: true },
      { name: "correo", label: "Correo", type: "email", required: true },
      { name: "procedencia", label: "Procedencia", type: "text", required: true },
      { name: "metodo_pagoFV", label: "Metodo de pago", type: "text", required: true },
    ],
  },
  empleado: {
    title: "Empleados",
    endpoint: "/empleado",
    keyField: "RUT_empleado",
    fields: [
      { name: "RUT_empleado", label: "RUT", type: "text", required: true },
      { name: "id_cargo", label: "Cargo", type: "select", optionsKey: "cargos", required: true, parseAsNumber: true },
      { name: "NIT_hotel", label: "Hotel", type: "select", optionsKey: "hoteles", required: true },
      { name: "nombre_empleado", label: "Nombre completo", type: "text", required: true },
      { name: "telefono_empleado", label: "Telefono", type: "text", required: true },
      { name: "direccion_empleado", label: "Direccion", type: "text", required: true },
      { name: "correo_electronico", label: "Correo electronico", type: "email", required: true },
      { name: "fecha_nacimiento", label: "Fecha de nacimiento", type: "date", required: true },
      { name: "EPS", label: "EPS", type: "text", required: true },
      { name: "salario", label: "Salario", type: "number", required: true },
      { name: "tipo_contrato", label: "Tipo de contrato", type: "text", required: true },
    ],
  },
  cargo: {
    title: "Cargos",
    endpoint: "/cargo",
    keyField: "id_cargo",
    fields: [
      { name: "cargo", label: "Nombre del cargo", type: "text", required: true },
      { name: "salario", label: "Salario", type: "number", required: true },
      { name: "horas_laborales", label: "Horas laborales", type: "number", required: true },
      { name: "tipo_contrato", label: "Tipo de contrato", type: "text", required: true },
      { name: "horario", label: "Horario", type: "text", required: true },
    ],
  },
  habitacion: {
    title: "Habitaciones",
    endpoint: "/habitacion",
    keyField: "id_habitacion",
    fields: [
      { name: "NIT_hotel", label: "Hotel", type: "select", optionsKey: "hoteles", required: true },
      { name: "tipo_habitacion", label: "Tipo de habitacion", type: "text", required: true },
      { name: "precio", label: "Precio", type: "number", required: true },
      { name: "capacidad", label: "Capacidad", type: "number", required: true },
    ],
  },
  reserva: {
    title: "Reservas",
    endpoint: "/reserva",
    keyField: "id_reserva",
    fields: [
      { name: "id_huesped", label: "Huesped", type: "select", optionsKey: "huespedes", required: true, parseAsNumber: true },
      { name: "habitaciones", label: "Habitaciones (separadas por coma)", type: "text", required: true },
      { name: "fecha_inicio", label: "Fecha de inicio", type: "date", required: true },
      { name: "fecha_fin", label: "Fecha de fin", type: "date", required: true },
      {
        name: "estado",
        label: "Estado",
        type: "select",
        staticOptions: [
          { value: "no disponible", label: "No disponible" },
          { value: "disponible", label: "Disponible" },
        ],
        required: true,
      },
    ],
  },
};

const SERVICE_ITEMS = [
  "Restaurante galardonado",
  "Spa y piscina cubierta",
  "Centro de fitness y entrenamiento personal",
  "Instalaciones para reuniones",
  "Servicios de conserjeria",
  "Wi-Fi gratuito",
  "Habitaciones con balcon privado",
  "Vistas panoramicas de la ciudad",
];

const ROOM_TYPES = [
  {
    title: "Suite ejecutiva",
    text: "Espacio amplio con cama king, sala privada y ambiente tranquilo para viajes de negocios o descanso.",
    meta: "Ideal para 2 personas",
  },
  {
    title: "Habitacion familiar",
    text: "Una opcion comoda para grupos pequenos, con capacidad ampliada y distribucion funcional.",
    meta: "Ideal para 4 personas",
  },
  {
    title: "Habitacion estandar",
    text: "Diseño sobrio, iluminacion calida y servicios esenciales para una estancia confortable en Manizales.",
    meta: "Ideal para 1 o 2 personas",
  },
];

const SECTION_PATHS = {
  inicio: "/",
  habitaciones: "/habitaciones",
  servicios: "/servicios",
  contacto: "/reserva-online",
  administrador: "/administrador",
};

const getRouteState = (pathname = "/") => {
  const cleanPath = pathname.toLowerCase().replace(/\/+$/, "") || "/";
  const moduleKey = cleanPath.slice(1);

  if (MODULES[moduleKey]) {
    return { section: "administrador", module: moduleKey };
  }

  switch (cleanPath) {
    case "/habitaciones":
      return { section: "habitaciones", module: "hotel" };
    case "/servicios":
      return { section: "servicios", module: "hotel" };
    case "/reserva-online":
      return { section: "contacto", module: "reserva" };
    case "/administrador":
      return { section: "administrador", module: "hotel" };
    default:
      return { section: "inicio", module: "hotel" };
  }
};

const createEmptyState = (moduleKey) => {
  const base = {};
  MODULES[moduleKey].fields.forEach((field) => {
    base[field.name] = field.name === "estado" ? "no disponible" : "";
  });
  return base;
};

const formatValueForForm = (value, type) => {
  if (value === null || value === undefined) return "";
  if (type === "date" && typeof value === "string") return value.slice(0, 10);
  return String(value);
};

const buildStateFromItem = (moduleKey, item) => {
  const state = createEmptyState(moduleKey);
  MODULES[moduleKey].fields.forEach((field) => {
    if (field.name === "habitaciones") {
      state[field.name] = item.habitaciones || "";
    } else {
      state[field.name] = formatValueForForm(item[field.name], field.type);
    }
  });
  return state;
};

const getOptionLabel = (option) => option.label ?? option.nombre ?? option.cargo ?? option.nombre_huesped ?? option.value;
const getOptionValue = (option) =>
  option.value ?? option.NIT_hotel ?? option.id_cargo ?? option.id_huesped ?? option.id_habitacion ?? option.RUT_empleado;

async function apiRequest(path, options = {}, token = "") {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof data === "string" ? data : data.message || data.error || "Error inesperado";
    throw new Error(message);
  }

  return data;
}

function App() {
  const initialRoute = getRouteState(window.location.pathname);
  const [session, setSession] = useState(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { token: "", user: null };
  });
  const [authForm, setAuthForm] = useState({ correo: "admin@everton.com", password: "admin123" });
  const [authError, setAuthError] = useState("");
  const [banner, setBanner] = useState("");
  const [activeSection, setActiveSection] = useState(initialRoute.section);
  const [activeModule, setActiveModule] = useState(initialRoute.module);
  const [moduleData, setModuleData] = useState({
    hotel: [],
    huesped: [],
    empleado: [],
    cargo: [],
    habitacion: [],
    reserva: [],
  });
  const [optionsData, setOptionsData] = useState({
    hoteles: [],
    cargos: [],
    huespedes: [],
    habitaciones: [],
  });
  const [formState, setFormState] = useState(createEmptyState("hotel"));
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = Boolean(session.token);
  const currentConfig = MODULES[activeModule];
  const currentRows = moduleData[activeModule];

  // request depende de la sesion actual; el efecto se vuelve a ejecutar cuando cambia isLoggedIn.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    const syncRoute = () => {
      const route = getRouteState(window.location.pathname);
      setActiveSection(route.section);
      setActiveModule(route.module);
    };

    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  // request usa el token activo; el modulo se vuelve a consultar al cambiar modulo o sesion.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setEditingItem(null);
    setFormState(createEmptyState(activeModule));
  }, [activeModule]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchSupportingData = async () => {
      try {
        const [hoteles, cargos, huespedes, habitaciones, user] = await Promise.all([
          apiRequest("/hotel", {}, session.token),
          apiRequest("/cargo", {}, session.token),
          apiRequest("/huesped", {}, session.token),
          apiRequest("/habitacion", {}, session.token),
          apiRequest("/auth/me", {}, session.token),
        ]);

        setOptionsData({
          hoteles: hoteles.map((item) => ({
            value: item.NIT_hotel,
            label: `${item.nombre} (${item.NIT_hotel})`,
          })),
          cargos: cargos.map((item) => ({
            value: item.id_cargo,
            label: item.cargo,
          })),
          huespedes: huespedes.map((item) => ({
            value: item.id_huesped,
            label: `${item.nombre_huesped} (#${item.id_huesped})`,
          })),
          habitaciones: habitaciones.map((item) => ({
            value: item.id_habitacion,
            label: `${item.tipo_habitacion} (#${item.id_habitacion})`,
          })),
        });

        setSession((current) => ({ ...current, user }));
      } catch (error) {
        setBanner(error.message);
      }
    };

    fetchSupportingData();
  }, [isLoggedIn, session.token]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchModuleData = async () => {
      try {
        setLoading(true);
        const data = await apiRequest(MODULES[activeModule].endpoint, {}, session.token);
        setModuleData((current) => ({ ...current, [activeModule]: Array.isArray(data) ? data : [data] }));
      } catch (error) {
        setBanner(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleData();
  }, [activeModule, isLoggedIn, session.token]);

  useEffect(() => {
    setOptionsData({
      hoteles: moduleData.hotel.map((item) => ({
        value: item.NIT_hotel,
        label: `${item.nombre} (${item.NIT_hotel})`,
      })),
      cargos: moduleData.cargo.map((item) => ({
        value: item.id_cargo,
        label: item.cargo,
      })),
      huespedes: moduleData.huesped.map((item) => ({
        value: item.id_huesped,
        label: `${item.nombre_huesped} (#${item.id_huesped})`,
      })),
      habitaciones: moduleData.habitacion.map((item) => ({
        value: item.id_habitacion,
        label: `${item.tipo_habitacion} (#${item.id_habitacion})`,
      })),
    });
  }, [moduleData.hotel, moduleData.cargo, moduleData.huesped, moduleData.habitacion]);

  const loadModule = async (moduleKey) => {
    try {
      setLoading(true);
      const data = await apiRequest(MODULES[moduleKey].endpoint, {}, session.token);
      setModuleData((current) => ({ ...current, [moduleKey]: Array.isArray(data) ? data : [data] }));
    } catch (error) {
      setBanner(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormState(createEmptyState(activeModule));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setAuthError("");
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(authForm),
      });
      setSession({ token: data.token, user: data.usuario });
      setBanner("Sesion iniciada correctamente.");

      const currentPath = window.location.pathname;
      const currentRoute = getRouteState(currentPath);
      const destination = currentRoute.module ? currentPath : "/hotel";
      navigateTo(destination);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleLogout = () => {
    setSession({ token: "", user: null });
    setBanner("Sesion cerrada.");
    navigateTo("/");
  };

  const handleFieldChange = (name, value) => {
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const navigateTo = (pathname) => {
    const route = getRouteState(pathname);
    if (window.location.pathname !== pathname) {
      window.history.pushState({}, "", pathname);
    }
    setActiveSection(route.section);
    setActiveModule(route.module);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToSection = (section) => {
    navigateTo(SECTION_PATHS[section] || "/");
  };

  const buildPayload = () => {
    const payload = {};

    MODULES[activeModule].fields.forEach((field) => {
      const value = formState[field.name];
      if (value === "") return;

      if (activeModule === "reserva" && field.name === "habitaciones") {
        payload.habitaciones = value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
          .map((item) => Number(item));
        return;
      }

      if (field.type === "number") {
        payload[field.name] = Number(value);
        return;
      }

      if (field.type === "select" && field.name !== "estado") {
        payload[field.name] = field.parseAsNumber ? Number(value) : value;
        return;
      }

      payload[field.name] = value;
    });

    return payload;
  };

  const refreshCurrentData = async () => {
    await Promise.all([
      loadModule(activeModule),
      loadModule("hotel"),
      loadModule("cargo"),
      loadModule("huesped"),
      loadModule("habitacion"),
    ]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const identifier = editingItem?.[currentConfig.keyField];
      const method = editingItem ? "PUT" : "POST";
      const path = editingItem ? `${currentConfig.endpoint}/${identifier}` : currentConfig.endpoint;

      await apiRequest(path, {
        method,
        body: JSON.stringify(buildPayload()),
      }, session.token);

      setBanner(`${currentConfig.title} ${editingItem ? "actualizado" : "creado"} correctamente.`);
      resetForm();
      await refreshCurrentData();
    } catch (error) {
      setBanner(error.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormState(buildStateFromItem(activeModule, item));
    navigateTo(`/${activeModule}`);
  };

  const handleDelete = async (item) => {
    const identifier = item[currentConfig.keyField];
    if (!window.confirm(`¿Eliminar ${currentConfig.title.toLowerCase()} ${identifier}?`)) return;

    try {
      await apiRequest(`${currentConfig.endpoint}/${identifier}`, { method: "DELETE" }, session.token);
      setBanner(`${currentConfig.title} eliminado correctamente.`);
      if (editingItem && editingItem[currentConfig.keyField] === identifier) {
        resetForm();
      }
      await refreshCurrentData();
    } catch (error) {
      setBanner(error.message);
    }
  };

  const handleReservationAction = async (reservationId, action) => {
    try {
      await apiRequest(`/reserva/${reservationId}/${action}`, { method: "PATCH" }, session.token);
      setBanner(`Reserva ${action} procesada correctamente.`);
      await loadModule("reserva");
    } catch (error) {
      setBanner(error.message);
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <img className="brand-logo" src="/logo_everton.jpg" alt="Hotel Everton" />
          <div>
            <p className="brand-title">Hotel Everton</p>
            <p className="brand-subtitle">Comodidad y calidad</p>
          </div>
        </div>

        <nav className="main-nav">
          <button type="button" className={activeSection === "inicio" ? "nav-link active" : "nav-link"} onClick={() => navigateTo("/")}>
            Inicio
          </button>
          <button type="button" className={activeSection === "administrador" ? "nav-link active" : "nav-link"} onClick={() => navigateTo("/administrador")}>
            Administrador
          </button>
          <button type="button" className={activeSection === "administrador" && activeModule === "empleado" ? "nav-link active" : "nav-link"} onClick={() => navigateTo("/empleado")}>
            Empleado
          </button>
          <button type="button" className={activeSection === "servicios" ? "nav-link active" : "nav-link"} onClick={() => navigateTo("/servicios")}>
            Servicios
          </button>
          <button type="button" className={activeSection === "contacto" ? "nav-link active nav-link-admin" : "nav-link nav-link-admin"} onClick={() => navigateTo("/reserva-online")}>
            Reserva online
          </button>
        </nav>

        <div className="session-panel">
          {isLoggedIn ? (
            <>
              <div className="session-user">
                <span className="session-avatar">{session.user?.correo?.charAt(0)?.toUpperCase() || "A"}</span>
                <div>
                  <p>{session.user?.correo}</p>
                  <small>{session.user?.rol || "Administrador"}</small>
                </div>
              </div>
              <button type="button" className="secondary-button" onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <button type="button" className="secondary-button" onClick={() => goToSection("administrador")}>
              Ingresar
            </button>
          )}
        </div>
      </header>

      {banner ? <div className="banner">{banner}</div> : null}

      <main className="page-content">
        {activeSection === "inicio" ? (
          <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Hotel Everton Manizales</p>
            <h1>Comodidad, descanso y una estancia pensada para sentirse bien.</h1>
            <p className="hero-text">
              Descubre un espacio elegante con habitaciones confortables, servicios exclusivos y una atencion cercana
              para viajes de descanso, negocios o celebraciones especiales.
            </p>
            <div className="hero-actions">
              <button type="button" className="primary-button" onClick={() => goToSection("habitaciones")}>
                Ver habitaciones
              </button>
              <button type="button" className="ghost-button" onClick={() => goToSection("servicios")}>
                Ver servicios
              </button>
            </div>
          </div>

          <div className="hero-grid">
            <article className="service-highlight">
              <p>Servicios para una experiencia memorable</p>
            </article>
            <article className="image-card orchid-card" />
            <article className="service-list">
              {SERVICE_ITEMS.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </article>
            <article className="image-card spa-card" />
          </div>
          </section>
        ) : null}

        {activeSection === "habitaciones" ? (
          <section className="content-section">
          <div className="section-heading">
            <p className="eyebrow">Habitaciones</p>
            <h2>Ambientes acogedores para una estadia tranquila y bien acompañada.</h2>
          </div>
          <div className="feature-grid">
            {ROOM_TYPES.map((room) => (
              <article className="feature-card room-card" key={room.title}>
                <span className="room-meta">{room.meta}</span>
                <h3>{room.title}</h3>
                <p>{room.text}</p>
                <button type="button" className="ghost-button room-button" onClick={() => goToSection("contacto")}>
                  Solicitar informacion
                </button>
              </article>
            ))}
          </div>
          </section>
        ) : null}

        {activeSection === "servicios" ? (
          <section className="content-section">
          <div className="section-heading">
            <p className="eyebrow">Servicios destacados</p>
            <h2>Todo lo necesario para disfrutar la experiencia del hotel desde el primer momento.</h2>
          </div>
          <div className="feature-grid">
            <article className="feature-card">
              <h3>Bienestar y relajacion</h3>
              <p>Spa, piscina cubierta y ambientes tranquilos para descansar con total comodidad.</p>
            </article>
            <article className="feature-card">
              <h3>Eventos y reuniones</h3>
              <p>Espacios funcionales para encuentros corporativos, reuniones privadas y celebraciones.</p>
            </article>
            <article className="feature-card">
              <h3>Atencion personalizada</h3>
              <p>Recepcion, conserjeria y servicio cercano para que tu estancia sea simple y agradable.</p>
            </article>
          </div>
          </section>
        ) : null}

        {activeSection === "contacto" ? (
          <section className="content-section">
          <div className="section-heading">
            <p className="eyebrow">Contacto y reservas</p>
            <h2>Estamos listos para ayudarte a planear tu visita y gestionar tus reservas.</h2>
          </div>
          <div className="reservation-promo">
            <div>
              <h3>Informacion del hotel</h3>
              <p>
                Estamos ubicados en Manizales, Caldas. Puedes comunicarte con nuestro equipo para disponibilidad,
                atencion a grupos, eventos o informacion general sobre alojamiento.
              </p>
              <ul className="contact-list">
                <li>Telefono: +57 300 000 0000</li>
                <li>Correo: reservas@hoteleverton.com</li>
                <li>Direccion: Centro de Manizales, Caldas</li>
              </ul>
            </div>
            <div className="promo-card">
              <p>Gestion interna</p>
              <strong>Panel administrativo</strong>
              <span>Ingresa para registrar huespedes, habitaciones y reservas.</span>
              <button type="button" className="primary-button promo-button" onClick={() => goToSection("administrador")}>
                Abrir gestion
              </button>
            </div>
          </div>
          </section>
        ) : null}

        {activeSection === "administrador" ? (
          <section className="dashboard-section">
          <div className="dashboard-intro">
            <div>
              <p className="eyebrow">Gestion del hotel</p>
              <h2>Administra la operacion del Hotel Everton desde un solo lugar.</h2>
            </div>
            <p>Modulos disponibles para hotel, huespedes, empleados, cargos, habitaciones y reservas.</p>
          </div>

          {!isLoggedIn ? (
            <form className="login-card" onSubmit={handleLogin}>
              <h3>Ingreso administrativo</h3>
              <p>Accede al panel para gestionar la informacion del hotel y operar el sistema de reservas.</p>
              <label>
                Correo
                <input
                  type="email"
                  value={authForm.correo}
                  onChange={(event) => setAuthForm((current) => ({ ...current, correo: event.target.value }))}
                  required
                />
              </label>
              <label>
                Contrasena
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))}
                  required
                />
              </label>
              {authError ? <p className="error-text">{authError}</p> : null}
              <button className="primary-button" type="submit">
                Entrar al panel
              </button>
            </form>
          ) : (
            <div className="dashboard-layout">
              <aside className="dashboard-sidebar">
                <h3>Modulos</h3>
                {Object.keys(MODULES).map((moduleKey) => (
                  <button
                    type="button"
                    key={moduleKey}
                    className={activeModule === moduleKey ? "sidebar-link active" : "sidebar-link"}
                    onClick={() => navigateTo(`/${moduleKey}`)}
                  >
                    {MODULES[moduleKey].title}
                  </button>
                ))}
              </aside>

              <div className="dashboard-main">
                <div className="panel-grid">
                  <section className="panel-card">
                    <div className="panel-header">
                      <div>
                        <p className="eyebrow">Formulario</p>
                        <h3>{editingItem ? `Editar ${currentConfig.title}` : `Crear ${currentConfig.title}`}</h3>
                      </div>
                      {editingItem ? (
                        <button type="button" className="secondary-button" onClick={resetForm}>
                          Cancelar edicion
                        </button>
                      ) : null}
                    </div>

                    <form className="module-form" onSubmit={handleSubmit}>
                      {currentConfig.fields.map((field) => {
                        const options = field.staticOptions || optionsData[field.optionsKey] || [];
                        const isReadOnlyIdentifier = editingItem && field.name === currentConfig.keyField;

                        return (
                          <label key={field.name}>
                            {field.label}
                            {field.type === "select" ? (
                              <select
                                value={formState[field.name]}
                                onChange={(event) => handleFieldChange(field.name, event.target.value)}
                                required={field.required}
                              >
                                <option value="">Selecciona una opcion</option>
                                {options.map((option) => (
                                  <option key={String(getOptionValue(option))} value={getOptionValue(option)}>
                                    {getOptionLabel(option)}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={field.type}
                                value={formState[field.name]}
                                onChange={(event) => handleFieldChange(field.name, event.target.value)}
                                required={field.required}
                                readOnly={isReadOnlyIdentifier}
                              />
                            )}
                          </label>
                        );
                      })}

                      <div className="form-actions">
                        <button className="primary-button" type="submit">
                          {editingItem ? "Guardar cambios" : "Crear registro"}
                        </button>
                        <button className="secondary-button" type="button" onClick={resetForm}>
                          Limpiar
                        </button>
                      </div>
                    </form>
                  </section>

                  <section className="panel-card">
                    <div className="panel-header">
                      <div>
                        <p className="eyebrow">Registros</p>
                        <h3>{currentConfig.title}</h3>
                      </div>
                      <button type="button" className="secondary-button" onClick={() => loadModule(activeModule)}>
                        Recargar
                      </button>
                    </div>

                    {loading ? (
                      <p className="empty-state">Cargando informacion...</p>
                    ) : currentRows.length === 0 ? (
                      <p className="empty-state">No hay registros disponibles para este modulo.</p>
                    ) : (
                      <div className="table-shell">
                        <table>
                          <thead>
                            <tr>
                              {Object.keys(currentRows[0]).map((column) => (
                                <th key={column}>{column}</th>
                              ))}
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentRows.map((row) => (
                              <tr key={String(row[currentConfig.keyField])}>
                                {Object.keys(currentRows[0]).map((column) => (
                                  <td key={`${row[currentConfig.keyField]}-${column}`}>{String(row[column] ?? "")}</td>
                                ))}
                                <td>
                                  <div className="table-actions">
                                    <button type="button" className="table-button edit" onClick={() => handleEdit(row)}>
                                      Editar
                                    </button>
                                    <button type="button" className="table-button delete" onClick={() => handleDelete(row)}>
                                      Eliminar
                                    </button>
                                    {activeModule === "reserva" ? (
                                      <>
                                        <button type="button" className="table-button" onClick={() => handleReservationAction(row.id_reserva, "confirmar")}>
                                          Confirmar
                                        </button>
                                        <button type="button" className="table-button" onClick={() => handleReservationAction(row.id_reserva, "checkin")}>
                                          Checkin
                                        </button>
                                        <button type="button" className="table-button" onClick={() => handleReservationAction(row.id_reserva, "checkout")}>
                                          Checkout
                                        </button>
                                        <button type="button" className="table-button" onClick={() => handleReservationAction(row.id_reserva, "cancelar")}>
                                          Cancelar
                                        </button>
                                      </>
                                    ) : null}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </div>
          )}
          </section>
        ) : null}
      </main>

      <footer className="site-footer">
        <div>
          <p>Hotel Everton</p>
          <p>Manizales, Caldas | +57 300 000 0000</p>
        </div>
        <button type="button" className="contact-button" onClick={() => goToSection("contacto")}>Contactenos</button>
      </footer>
    </div>
  );
}

export default App;
