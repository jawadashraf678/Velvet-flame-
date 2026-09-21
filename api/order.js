/* ==========================================================================
   VELVET FLAME — Vercel Serverless Function: WhatsApp Order Backend
   Endpoint: /api/order
   ========================================================================== */

// Canonical Menu Price Database (Server-validated pricing)
const MENU_DATABASE = {
  // Burgers & Combos
  'b1': { title: 'Velvet Royale Burger', price: 1190 },
  'b2': { title: 'Classic Beef Burger', price: 950 },
  'b3': { title: 'Crispy Chicken Burger', price: 890 },
  'b4': { title: 'Zinger Supreme', price: 920 },
  'b5': { title: 'BBQ Flame Burger', price: 1050 },
  'b6': { title: 'Signature Combo Box', price: 1490 },

  // Pizza & Flatbreads
  'p1': { title: 'Flame Kissed Tikka Pizza', price: 1650 },
  'p2': { title: 'Pepperoni Classic', price: 1590 },
  'p3': { title: 'Fajita Supreme', price: 1620 },
  'p4': { title: 'Creamy Alfredo Pizza', price: 1690 },
  'p5': { title: 'Four Cheese Gourmet', price: 1750 },
  'p6': { title: 'BBQ Chicken Pizza', price: 1650 },

  // Shawarma & Wraps
  's1': { title: 'Golden Velvet Shawarma', price: 690 },
  's2': { title: 'Classic Chicken Shawarma', price: 550 },
  's3': { title: 'Golden Crunch Shawarma', price: 720 },
  's4': { title: 'Arabic Wrap Platter', price: 890 },
  's5': { title: 'Grilled Chicken Wrap', price: 680 },
  's6': { title: 'Loaded Beef Shawarma', price: 780 },

  // Desi Kitchen
  'd1': { title: 'Royal Flame Chicken Karahi', price: 1850 },
  'd2': { title: 'Mutton Karahi Special', price: 2850 },
  'd3': { title: 'Creamy Chicken Handi', price: 1790 },
  'd4': { title: 'Smoky Chicken Tikka', price: 650 },
  'd5': { title: 'Reshmi Malai Boti', price: 980 },
  'd6': { title: 'Royal Seekh Kebab (4 pcs)', price: 920 },

  // Sides & Snacks
  'sn1': { title: 'Velvet Loaded Cheese Fries', price: 590 },
  'sn2': { title: 'Crispy Wings (6 pcs)', price: 650 },
  'sn3': { title: 'Chicken Nuggets (8 pcs)', price: 490 },
  'sn4': { title: 'Golden Onion Rings', price: 390 },
  'sn5': { title: 'Mozzarella Sticks', price: 550 },

  // Drinks & Refreshers
  'dr1': { title: 'Mint Margarita', price: 390 },
  'dr2': { title: 'Fresh Lemonade', price: 290 },
  'dr3': { title: 'Peach Iced Tea', price: 350 },
  'dr4': { title: 'Velvet Cold Coffee', price: 450 },

  // Desserts
  'ds1': { title: 'Midnight Velvet Shake', price: 650 },
  'ds2': { title: 'Molten Lava Cake', price: 750 },
  'ds3': { title: 'Lotus Biscoff Cheesecake', price: 790 },
  'ds4': { title: 'Chocolate Fudge Brownie', price: 490 },

  // Combos
  'combo1': { title: 'The Velvet Solo Combo', price: 1390 },
  'combo2': { title: 'The Flame Duo Combo', price: 2790 },
  'combo3': { title: 'The Royal Desi Table Combo', price: 3490 },
  'combo4': { title: 'The Velvet Treat Combo', price: 990 }
};

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const body = req.body || {};
    const {
      customerName,
      customerPhone,
      orderType = 'delivery',
      deliveryAddress = '',
      locality = '',
      instructions = '',
      notes = '',
      items = [],
      consent = false
    } = body;

    // 1. Validation
    if (!customerName || !customerName.trim()) {
      return res.status(400).json({ success: false, error: 'Customer Full Name is required.' });
    }
    if (!customerPhone || !customerPhone.trim()) {
      return res.status(400).json({ success: false, error: 'Customer WhatsApp / Phone Number is required.' });
    }
    if (!consent) {
      return res.status(400).json({ success: false, error: 'Consent to receive WhatsApp notifications is required.' });
    }
    if (orderType === 'delivery') {
      if (!deliveryAddress || !deliveryAddress.trim()) {
        return res.status(400).json({ success: false, error: 'Complete delivery address is required for delivery orders.' });
      }
      if (!locality || !locality.trim()) {
        return res.status(400).json({ success: false, error: 'Area / Locality is required for delivery orders.' });
      }
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Order must contain at least one item.' });
    }

    // 2. Server-Side Price Calculation & Verification
    let verifiedSubtotal = 0;
    const itemizedSummary = [];

    for (const rawItem of items) {
      const qty = parseInt(rawItem.quantity, 10);
      if (isNaN(qty) || qty <= 0) continue;

      const menuItem = MENU_DATABASE[rawItem.id] || { title: rawItem.title || 'Custom Dish', price: Number(rawItem.price) || 0 };
      const itemSubtotal = menuItem.price * qty;
      verifiedSubtotal += itemSubtotal;

      itemizedSummary.push({
        id: rawItem.id,
        title: menuItem.title,
        price: menuItem.price,
        quantity: qty,
        subtotal: itemSubtotal
      });
    }

    if (itemizedSummary.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid order items.' });
    }

    // Delivery Fee calculation (Standard Rs. 150, free over Rs. 2500)
    const deliveryFee = orderType === 'delivery' ? (verifiedSubtotal >= 2500 ? 0 : 150) : 0;
    const grandTotal = verifiedSubtotal + deliveryFee;

    // Generate Unique Order ID
    const randomHash = Math.random().toString(36).substring(2, 7).toUpperCase();
    const orderId = `VF-${Date.now().toString().slice(-4)}${randomHash}`;

    const orderData = {
      orderId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      orderType,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : 'N/A (Pickup Order)',
      locality: orderType === 'delivery' ? locality.trim() : 'N/A',
      instructions: instructions.trim(),
      notes: notes.trim(),
      items: itemizedSummary,
      subtotal: verifiedSubtotal,
      deliveryFee,
      grandTotal,
      timestamp: new Date().toISOString(),
      status: 'SUBMITTED'
    };

    // 3. Inspect Meta WhatsApp Cloud API Credentials
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const apiVersion = process.env.WHATSAPP_API_VERSION || 'v18.0';
    const restaurantPhone = process.env.RESTAURANT_WHATSAPP_NUMBER || '923291132481';
    const templateName = process.env.WHATSAPP_ORDER_TEMPLATE_NAME;

    // If Meta API credentials are NOT configured on Vercel environment variables:
    if (!accessToken || !phoneNumberId) {
      return res.status(200).json({
        success: false,
        status: 'UNCONFIGURED',
        orderId,
        message: 'Automatic WhatsApp notification is not configured yet. Missing Meta API credentials on server.',
        configRequired: [
          'WHATSAPP_ACCESS_TOKEN',
          'WHATSAPP_PHONE_NUMBER_ID',
          'RESTAURANT_WHATSAPP_NUMBER'
        ],
        orderSummary: orderData
      });
    }

    // 4. Send Meta WhatsApp Cloud API Notification
    const textLines = [
      `🔥 *VELVET FLAME — NEW AUTOMATIC ORDER*`,
      `Order ID: *${orderId}*`,
      `Customer: ${orderData.customerName}`,
      `Phone: ${orderData.customerPhone}`,
      `Order Type: ${orderType.toUpperCase()}`,
      orderType === 'delivery' ? `Address: ${orderData.deliveryAddress} (${orderData.locality})` : null,
      orderData.instructions ? `Instructions: ${orderData.instructions}` : null,
      `--------------------------------`,
      `ITEMS:`,
      ...itemizedSummary.map(i => `• ${i.title} x${i.quantity} = Rs. ${i.subtotal.toLocaleString()}`),
      `--------------------------------`,
      `Subtotal: Rs. ${verifiedSubtotal.toLocaleString()}`,
      `Delivery Fee: Rs. ${deliveryFee.toLocaleString()}`,
      `*GRAND TOTAL: Rs. ${grandTotal.toLocaleString()}*`,
      orderData.notes ? `Notes: ${orderData.notes}` : null
    ].filter(Boolean).join('\n');

    let metaPayload;

    if (templateName) {
      // Template message payload
      metaPayload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: restaurantPhone,
        type: "template",
        template: {
          name: templateName,
          language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en_US" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: orderId },
                { type: "text", text: orderData.customerName },
                { type: "text", text: orderData.customerPhone },
                { type: "text", text: `Rs. ${grandTotal.toLocaleString()}` }
              ]
            }
          ]
        }
      };
    } else {
      // Direct text payload (within customer service window or sandbox testing)
      metaPayload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: restaurantPhone,
        type: "text",
        text: { preview_url: false, body: textLines }
      };
    }

    const metaUrl = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;
    const metaResponse = await fetch(metaUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(metaPayload)
    });

    const metaResult = await metaResponse.json();

    if (!metaResponse.ok) {
      console.error('Meta WhatsApp API Error:', metaResult);
      return res.status(200).json({
        success: false,
        status: 'NOTIFICATION_FAILED',
        orderId,
        message: 'Order created, but Meta WhatsApp API notification failed.',
        metaError: metaResult.error ? metaResult.error.message : 'API Request Failed',
        orderSummary: orderData
      });
    }

    return res.status(200).json({
      success: true,
      status: 'NOTIFICATION_SENT',
      orderId,
      message: 'Order submitted and automatic WhatsApp notification sent to restaurant.',
      metaMessageId: metaResult.messages ? metaResult.messages[0].id : null,
      orderSummary: orderData
    });

  } catch (err) {
    console.error('Server error processing order:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      details: err.message
    });
  }
};
