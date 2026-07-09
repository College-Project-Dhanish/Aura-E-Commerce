import { Product } from '../types';

export const products: Product[] = [
  {
    id: 1,
    name: "Heavyweight Organic Cotton Tee",
    slug: "heavyweight-organic-cotton-tee",
    description: "Crafted from 280GSM organic cotton, this t-shirt features a structured, boxy fit with dry-hand feel. Built to maintain its shape over time, it features thick collar ribbing, dropped shoulders, and clean double-needle stitching. Designed in-house for the ultimate luxury drape.",
    price: 45,
    original_price: 60,
    category: "t-shirts",
    collection: "Essential Drop",
    is_new: true,
    is_best_seller: true,
    is_trending: false,
    stock: 25,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      {
        name: "Obsidian Black",
        code: "#171717",
        images: [
          "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1503341455253-b26412093475?auto=format&fit=crop&w=800&q=80"
        ]
      },
      {
        name: "Parchment White",
        code: "#F5F5F0",
        images: [
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=800&q=80"
        ]
      },
      {
        name: "Slate Gray",
        code: "#707072",
        images: [
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1503341509151-0800735f252a?auto=format&fit=crop&w=800&q=80"
        ]
      }
    ],
    features: [
      "100% GOTS certified organic cotton",
      "Heavyweight 280 GSM fabric for structured drape",
      "Thick 1.2\" rib mock neck collar",
      "Pre-shrunk to prevent shrinkage",
      "Ethically milled and tailored"
    ],
    specifications: {
      "Fabric": "100% Organic Cotton",
      "Weight": "280 GSM",
      "Fit": "Oversized / Boxy",
      "Origin": "Portugal",
      "Care": "Machine wash cold, lay flat to dry"
    },
    reviews: [
      {
        id: 101,
        user_name: "Alexander M.",
        rating: 5,
        comment: "Absolutely incredible weight. It drapes beautifully, unlike cheap tees. I bought the Parchment White and it's not see-through at all.",
        date: "2026-06-12",
        variant_sku: "TEE-HWOC-BLK-M"
      },
      {
        id: 102,
        user_name: "Marcus V.",
        rating: 4,
        comment: "The collar is tight and durable, fits well around the neck. The oversized cut is boxy, so size down if you want a slimmer look.",
        date: "2026-05-30",
        variant_sku: "TEE-HWOC-WHT-L"
      }
    ]
  },
  {
    id: 2,
    name: "Premium Linen Relaxed Shirt",
    slug: "premium-linen-relaxed-shirt",
    description: "An elegant warm-weather staple, our relaxed linen shirt is cut from high-grade European flax. Highly breathable and garment-dyed for a washed, comfortable hand-feel. Features a refined French placket, curved hem, and premium mother-of-pearl buttons. Ideal for sophisticated casual layering.",
    price: 85,
    original_price: 110,
    category: "shirts",
    collection: "Classic Minimalist",
    is_new: false,
    is_best_seller: true,
    is_trending: true,
    stock: 12,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      {
        name: "Sand Beige",
        code: "#D2C5B4",
        images: [
          "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1598033129130-1011ffcc061c?auto=format&fit=crop&w=800&q=80"
        ]
      },
      {
        name: "Chalk White",
        code: "#FFFFFF",
        images: [
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=800&q=80"
        ]
      }
    ],
    features: [
      "100% European premium flax linen",
      "Garment-washed for exceptional softness",
      "Real mother-of-pearl buttons",
      "Relaxed, modern fit with a gentle curve hem",
      "Highly breathable open-weave structure"
    ],
    specifications: {
      "Fabric": "100% European Flax Linen",
      "Weight": "150 GSM",
      "Fit": "Relaxed / Casual",
      "Origin": "Italy",
      "Care": "Hand wash or dry clean recommended"
    },
    reviews: [
      {
        id: 201,
        user_name: "Sarah K.",
        rating: 5,
        comment: "This linen is extremely soft, not scratchy at all! It looks so luxury. Bought for my partner and he gets compliments everywhere.",
        date: "2026-07-01",
        variant_sku: "SHI-PLR-SND-M"
      }
    ]
  },
  {
    id: 3,
    name: "Minimalist Structured Oxford Shirt",
    slug: "minimalist-structured-oxford-shirt",
    description: "A timeless classic re-engineered with modern proportions. Cut from heavyweight 2-ply Oxford cotton weave that feels substantial and durable. Features a perfectly proportioned button-down collar, single chest pocket, and a clean box pleat for comfortable movement. A versatile centerpiece for any minimalist capsule wardrobe.",
    price: 75,
    category: "shirts",
    collection: "Classic Minimalist",
    is_new: true,
    is_best_seller: false,
    is_trending: true,
    stock: 18,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      {
        name: "Classic Oxford Blue",
        code: "#A4C3D2",
        images: [
          "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1588359348347-9bc6cbaa689f?auto=format&fit=crop&w=800&q=80"
        ]
      },
      {
        name: "Parchment White",
        code: "#F5F5F0",
        images: [
          "https://images.unsplash.com/photo-1621072156002-e2fcc103e86e?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
        ]
      }
    ],
    features: [
      "100% premium long-staple 2-ply cotton Oxford",
      "Thick-structured weave with beautiful natural texture",
      "Button-down roll collar that maintains its shape",
      "Genuine mother-of-pearl buttons",
      "Slightly curved hem and refined wrist cuffs"
    ],
    specifications: {
      "Fabric": "100% Cotton Oxford",
      "Weight": "190 GSM",
      "Fit": "Regular Tailored",
      "Origin": "Japan",
      "Care": "Warm machine wash, medium iron"
    },
    reviews: [
      {
        id: 301,
        user_name: "David T.",
        rating: 5,
        comment: "Excellent drape and very sturdy weave. This is easily comparable to $150 shirts from premium designer labels. Will definitely purchase another.",
        date: "2026-06-25",
        variant_sku: "SHI-MSO-BLU-L"
      }
    ]
  },
  {
    id: 4,
    name: "Luxury Pima Interlock Tee",
    slug: "luxury-pima-interlock-tee",
    description: "The softest tee you will ever own. Made of 100% double-knit Peruvian Pima cotton with an interlock structure that feels unbelievably silky. Features flatlock detailing, a soft rib collar, and a modern tailored fit that hugs the shoulders while remaining relaxed at the waist. Perfect for everyday luxury.",
    price: 50,
    category: "t-shirts",
    collection: "Urban Essentials",
    is_new: false,
    is_best_seller: false,
    is_trending: true,
    stock: 30,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      {
        name: "Sage Green",
        code: "#7D8C83",
        images: [
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80"
        ]
      },
      {
        name: "Obsidian Black",
        code: "#171717",
        images: [
          "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1503341455253-b26412093475?auto=format&fit=crop&w=800&q=80"
        ]
      }
    ],
    features: [
      "100% Peruvian Pima cotton",
      "Double-knit interlock structure for silky-smooth touch",
      "Clean look neck band with tonal topstitching",
      "Naturally anti-pilling and colorfast",
      "Tailored fit with subtle side-split hems"
    ],
    specifications: {
      "Fabric": "100% Peruvian Pima Cotton",
      "Weight": "220 GSM",
      "Fit": "Tailored / Athletic Drape",
      "Origin": "Peru",
      "Care": "Cold wash, wash inside out to maintain luster"
    },
    reviews: [
      {
        id: 401,
        user_name: "Lucas E.",
        rating: 5,
        comment: "This material is liquid gold. So incredibly smooth and has a subtle sheen that makes it look super high-end. Fits perfectly.",
        date: "2026-07-03",
        variant_sku: "TEE-LPIM-SAG-XL"
      }
    ]
  },
  {
    id: 5,
    name: "Classic Resort Collar Shirt",
    slug: "classic-resort-collar-shirt",
    description: "Inspired by mid-century Mediterranean styles, this short-sleeve resort collar shirt is woven in an ultra-fine cotton-tencel blend. Offering a cool, breezy feel and a beautiful fluid drape, it features a relaxed open collar, a clean-edge straight hem, and subtle vintage-style buttons. Perfect for tropical climates or styled casually open over a t-shirt.",
    price: 68,
    original_price: 85,
    category: "shirts",
    collection: "Summer Drop",
    is_new: true,
    is_best_seller: false,
    is_trending: false,
    stock: 15,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      {
        name: "Oatmeal Beige",
        code: "#E5DCD3",
        images: [
          "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1598033129130-1011ffcc061c?auto=format&fit=crop&w=800&q=80"
        ]
      },
      {
        name: "Obsidian Black",
        code: "#171717",
        images: [
          "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1503341455253-b26412093475?auto=format&fit=crop&w=800&q=80"
        ]
      }
    ],
    features: [
      "55% Premium Organic Cotton, 45% Tencel Lyocell",
      "Fluid, drape-heavy weave with silky hand-feel",
      "Relaxed campfire resort collar",
      "Straight hem with side vents for untucked wear",
      "Highly breathable and fast-drying"
    ],
    specifications: {
      "Fabric": "55% Cotton, 45% Tencel",
      "Weight": "135 GSM",
      "Fit": "Relaxed / Breezy",
      "Origin": "Portugal",
      "Care": "Delicate machine wash cold, hang dry"
    },
    reviews: []
  },
  {
    id: 6,
    name: "Premium Structured Boxy Tee",
    slug: "premium-structured-boxy-tee",
    description: "An everyday heavyweight mock neck T-shirt with a contemporary boxy silhouette. Made from a dense premium cotton blend, it provides a stiff structural fold, retaining its clean form throughout any outfit. Accentuated by a broad rib collar and seamless clean shoulders for a sleek, modern aesthetic.",
    price: 48,
    category: "t-shirts",
    collection: "Urban Essentials",
    is_new: false,
    is_best_seller: true,
    is_trending: true,
    stock: 20,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      {
        name: "Alabaster White",
        code: "#FAFAFA",
        images: [
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=800&q=80"
        ]
      },
      {
        name: "Minimalist Gray",
        code: "#D4D4D4",
        images: [
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1503341509151-0800735f252a?auto=format&fit=crop&w=800&q=80"
        ]
      }
    ],
    features: [
      "90% organic long-staple cotton, 10% premium polyester for stiffness",
      "Dense 300 GSM interlock weave",
      "Extra wide double-knit collar band",
      "Drop shoulders and drop sleeve seams",
      "Reinforced taped shoulder-to-shoulder seams"
    ],
    specifications: {
      "Fabric": "90% Cotton, 10% Polyester",
      "Weight": "300 GSM",
      "Fit": "Oversized Boxy",
      "Origin": "South Korea",
      "Care": "Wash inside out, wash with similar colors"
    },
    reviews: [
      {
        id: 601,
        user_name: "James L.",
        rating: 5,
        comment: "This is the absolute best boxy tee. It maintains a stiff streetwear aesthetic. Doesn't drape flat like other light shirts.",
        date: "2026-07-06",
        variant_sku: "TEE-PSBT-WHT-L"
      }
    ]
  }
];
