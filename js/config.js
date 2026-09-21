/* ==========================================================================
   VELVET FLAME — Restaurant & WhatsApp Order Configuration
   ========================================================================== */

const RESTAURANT_CONFIG = {
  name: "VELVET FLAME",
  tagline: "Where Luxury Meets the Flame",
  phoneDisplay: "+92 329 1132481",
  whatsappNumber: "923291132481", // wa.me format without '+' or spaces
  currency: "Rs.",
  
  // Delivery Fee Configuration
  deliveryFee: 150,               // Standard delivery fee in PKR
  freeDeliveryThreshold: 2500,     // Orders above this amount get free delivery (set 0 to disable)
  
  // Backend API Endpoint for Method B (Vercel Serverless Function)
  apiEndpoint: "/api/order"
};

// Freeze configuration to prevent accidental modification
Object.freeze(RESTAURANT_CONFIG);
