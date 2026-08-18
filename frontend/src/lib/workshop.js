export const WORKSHOP = {
  name: "Faizan Motor Workshop",
  shortName: "FMW",
  address: "372-F1, Johar Town, Lahore, Punjab, Pakistan",
  phoneDisplay: "0302 2222027",
  phoneIntl: "+923022222027",
  whatsappIntl: "923022222027",
  hours: "Monday – Saturday, 9:00 AM – 9:00 PM",
  mapsQuery: "372-F1 Johar Town, Lahore, Punjab, Pakistan",
};

export const telHref = `tel:${WORKSHOP.phoneIntl}`;

export const waHref = (message = "Assalam-o-Alaikum! I need help with my car at Faizan Motor Workshop.") =>
  `https://wa.me/${WORKSHOP.whatsappIntl}?text=${encodeURIComponent(message)}`;

export const mapsDirections = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(WORKSHOP.mapsQuery)}`;
export const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(WORKSHOP.mapsQuery)}&output=embed`;

export const DEPTS = [
  {
    key: "motor",
    label: "Motor Work & Technical",
    short: "Motor Work",
    tagline: "Engine, brakes, clutch, gearbox",
    blurb:
      "Complete mechanical diagnosis and repair — engines, oil service, brakes, suspension, clutch, gearbox, overheating and full vehicle inspection.",
  },
  {
    key: "electrical",
    label: "Auto Electrical",
    short: "Auto Electrical",
    tagline: "Battery, wiring, sensors, lights",
    blurb:
      "Specialist auto electricians for batteries, self starters, alternators, complete wiring, lights, sensors, central locking and power windows.",
  },
  {
    key: "denting",
    label: "Denting & Body Work",
    short: "Denting",
    tagline: "Dents, accident & panel repair",
    blurb:
      "Expert denters for dent removal, accident damage restoration, bumper, door and fender repair, and full body panel work.",
  },
  {
    key: "painting",
    label: "Painting & Finishing",
    short: "Painting",
    tagline: "Full paint, colour match, polish",
    blurb:
      "Oven-finish full and partial painting, computerised colour matching, touch-ups, cutting, buffing and mirror polishing.",
  },
];

export const deptMeta = (key) => DEPTS.find((d) => d.key === key);

export const roleToDept = { motor: "motor", electrical: "electrical", denter: "denting", painter: "painting" };

export const STATUS_FLOW = ["received", "reviewing", "contacted", "inspection", "in_progress", "completed"];

export const STATUS_LABEL = {
  received: "Request Received",
  reviewing: "Reviewing",
  contacted: "Contacted",
  inspection: "Inspection Required",
  in_progress: "Work in Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_TONE = {
  received: "bg-accent/15 text-accent border-accent/30",
  reviewing: "bg-accent/15 text-accent border-accent/30",
  contacted: "bg-warning/15 text-warning border-warning/30",
  inspection: "bg-warning/15 text-warning border-warning/30",
  in_progress: "bg-primary/15 text-primary border-primary/30",
  completed: "bg-success/15 text-success border-success/30",
  cancelled: "bg-muted text-muted-foreground border-border",
};

export const MAX_IMAGES = 6;
export const MAX_VIDEOS = 2;
export const MAX_IMAGE_MB = 8;
export const MAX_VIDEO_MB = 60;

export const isValidPkPhone = (value) => /^(\+92\d{10}|03\d{9})$/.test(String(value || "").replace(/[^\d+]/g, ""));
