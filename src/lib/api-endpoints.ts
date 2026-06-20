export const API = {
  // Auth
  auth: {
    requestOtp:    "/api/auth/otp/request",
    verifyOtp:     "/api/auth/otp/verify",
    refresh:       "/api/auth/refresh",
    logout:        "/api/auth/logout",
    google:        "/api/auth/google",
    facebook:      "/api/auth/facebook",
    line:          "/api/auth/line",
  },

  // Products
  products: {
    list:          "/api/products",
    detail:        (id: string) => `/api/products/${id}`,
    flashDeals:    "/api/products/flash-deals",
    search:        "/api/products/search",
  },

  // Cart
  cart: {
    validateCoupon: "/api/coupons/validate",
  },

  // Checkout
  checkout: {
    shippingOptions: "/api/shipping/options",
    placeOrder:      "/api/orders",
  },

  // Orders
  orders: {
    list:          "/api/orders",
    detail:        (id: string) => `/api/orders/${id}`,
    cancel:        (id: string) => `/api/orders/${id}/cancel`,
  },

  // Returns & Reviews
  returns:         "/api/returns",
  reviews:         "/api/reviews",

  // User
  user: {
    profile:       "/api/user/profile",
    pointsHistory: "/api/user/points/history",
  },

  // Wishlist
  wishlist: {
    list:          "/api/wishlist",
    add:           "/api/wishlist",
    remove:        (id: string) => `/api/wishlist/${id}`,
  },

  // Notifications
  notifications: {
    list:          "/api/notifications",
    markRead:      (id: string) => `/api/notifications/${id}/read`,
    markAllRead:   "/api/notifications/read-all",
    delete:        (id: string) => `/api/notifications/${id}`,
  },

  // Campaigns
  campaigns: {
    list:          "/api/campaigns",
    detail:        (slug: string) => `/api/campaigns/${slug}`,
    flashSession:  "/api/campaigns/flash-sale/current",
  },
} as const;
