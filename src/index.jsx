import React, { Suspense, lazy, useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./index.css";
import "./App.css";
import "./mobile-responsive.css";
import "./mobile-cart-fix.css";
import "./mobile-fixes.css";
import { initMobileEnhancements } from "./utils/mobileCartUtils.js";
//king safari size
// Hook
import { useProductFilters } from "./hooks/useProductFilters.js";
import { useLoadingStates } from "./hooks/useLoadingStates.js";
import { useCart } from "./context/CartContext.jsx";

// Components - Using lazy loading for better performance
const Navigation = lazy(() => import("./components/Navigation.jsx"));
const HomePage = lazy(() => import("./components/pages/HomePage.jsx"));
const ProductsPage = lazy(() => import("./components/pages/ProductsPage.jsx"));
const MensShoesPage = lazy(
  () => import("./components/pages/MensShoesPage.jsx"),
);
const WomensShoesPage = lazy(
  () => import("./components/pages/WomensShoesPage.jsx"),
);
const BrandsPage = lazy(() => import("./components/pages/BrandsPage.jsx"));
const AboutPage = lazy(() => import("./components/pages/AboutPage.jsx"));
const CartPage = lazy(() => import("./components/pages/CartPage.jsx"));
const CheckoutPage = lazy(() => import("./components/pages/CheckoutPage.jsx"));
const OrderConfirmation = lazy(
  () => import("./components/OrderConfirmation.jsx"),
);
const ProductDetailPage = lazy(
  () => import("./components/pages/ProductDetailPage.jsx"),
);
const Footer = lazy(() => import("./components/Footer.jsx"));
const WhatsAppFloat = lazy(() => import("./components/WhatsAppFloat.jsx"));
const QuickViewModal = lazy(() => import("./components/QuickViewModal.jsx"));
const SuccessNotification = lazy(
  () => import("./components/SuccessNotification.jsx"),
);
const SafariNotificationBanner = lazy(
  () => import("./components/SafariNotificationBanner.jsx"),
);
const SafariDiagnostic = lazy(
  () => import("./components/SafariDiagnostic.jsx"),
);
const SafariTestPage = lazy(
  () => import("./components/SafariTestPage.jsx"),
);


// Optimized products data with performance in mind - All prices are on sale!
const products = [
  {
    id: 1,
    name: "Nike Air Force 1 '07 Triple White",
    price: 1550,
    originalPrice: 2000,
    image: "/Sneakers photos/AF1.jpg",
    images: ["/Sneakers photos/AF1.jpg"],
    rating: 4.8,
    brand: "Nike",
    category: "Lifestyle",
    gender: "unisex",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "38", available: true },
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 2,
    name: "Adidas Samba OG 'White Black Gum'",
    price: 1550,
    originalPrice: 2000,
    image: "/Sneakers photos/AdidasSambaOG‘WhiteBlackGum’.jpg",
    images: ["/Sneakers photos/AdidasSambaOG‘WhiteBlackGum’.jpg"],
    rating: 4.7,
    brand: "Adidas",
    category: "Lifestyle",
    gender: "unisex",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "38", available: true },
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 3,
    name: "ASICS Gel-Kayano 14 'Silver Cream'",
    price: 1800,
    originalPrice: 2400,
    image: "/Sneakers photos/AsicsGelKayano14SilverCream1201A019-108.jpg",
    images: ["/Sneakers photos/AsicsGelKayano14SilverCream1201A019-108.jpg"],
    rating: 4.3,
    brand: "ASICS",
    category: "Running",
    gender: "unisex",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "38", available: true },
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 4,
    name: "ASICS Gel-Kahana 8",
    price: 1800,
    originalPrice: 2100,
    image: "/Sneakers photos/asicsgelkahanam8.jpg",
    images: ["/Sneakers photos/asicsgelkahanam8.jpg"],
    rating: 4.3,
    brand: "ASICS",
    category: "Trail Running",
    gender: "men",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 5,
    name: "ASICS Gel-Kahana 8 'Black Rose Gold'",
    price: 1800,
    originalPrice: 2200,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F0ebe16fdd0024a4da3822a9f17207c5b%2F2d2ab23252bf44d3be4cf2ecc2498ed7?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2F0ebe16fdd0024a4da3822a9f17207c5b%2F2d2ab23252bf44d3be4cf2ecc2498ed7?format=webp&width=800",
    ],
    rating: 4.2,
    brand: "ASICS",
    category: "Trail Running",
    gender: "men",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 6,
    name: "ASICS Gel-NYC Black Ivory Gray",
    price: 1800,
    originalPrice: 2300,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fad0a7923005f4b5580ccccd0bb24c27b%2F04252309c75a4b36994000652a7291f5?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fad0a7923005f4b5580ccccd0bb24c27b%2F04252309c75a4b36994000652a7291f5?format=webp&width=800",
    ],
    rating: 4.6,
    brand: "ASICS",
    category: "Running",
    gender: "men",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 7,
    name: "New Balance 2002R",
    price: 1900,
    originalPrice: 2300,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F0ebe16fdd0024a4da3822a9f17207c5b%2Fec15e922feba436ca22cb819da8356b4?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2F0ebe16fdd0024a4da3822a9f17207c5b%2Fec15e922feba436ca22cb819da8356b4?format=webp&width=800",
    ],
    rating: 4.7,
    brand: "New Balance",
    category: "Lifestyle",
    gender: "unisex",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "38", available: true },
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 8,
    name: "Jordan 1 Low Light Smoke Grey",
    price: 1700,
    originalPrice: 2200,
    image: "/Sneakers photos/Jordan1LowLightSmokeGrey.jpg",
    images: ["/Sneakers photos/Jordan1LowLightSmokeGrey.jpg"],
    rating: 4.5,
    brand: "Jordan",
    category: "Basketball",
    gender: "men",
    condition: "Brand New",

    isNew: true,
    onSale: false,
    sizes: [
      { value: "38", available: true },
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 9,
    name: "Adidas Forum Low White Royal Blue",
    price: 1800,
    originalPrice: 2200,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F0ebe16fdd0024a4da3822a9f17207c5b%2F4cb179e89e3d4cd9813ea841773f910d?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2F0ebe16fdd0024a4da3822a9f17207c5b%2F4cb179e89e3d4cd9813ea841773f910d?format=webp&width=800",
    ],
    rating: 4.5,
    brand: "Adidas",
    category: "Lifestyle",
    gender: "unisex",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "38", available: true },
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 10,
    name: "New Balance 530 'Concrete Grey'",
    price: 1550,
    originalPrice: 2000,
    image: "/Sneakers photos/NB53.jpg",
    images: ["/Sneakers photos/NB53.jpg"],
    rating: 4.4,
    brand: "New Balance",
    category: "Lifestyle",
    gender: "unisex",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "38", available: true },
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 11,
    name: "Air Jordan 11 Retro Space Jam 2016",
    price: 1900,
    originalPrice: 2400,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F0ebe16fdd0024a4da3822a9f17207c5b%2Ff081d39b8db349008b3320f7198392c3?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2F0ebe16fdd0024a4da3822a9f17207c5b%2Ff081d39b8db349008b3320f7198392c3?format=webp&width=800",
    ],
    rating: 4.9,
    brand: "Jordan",
    category: "Basketball",
    gender: "men",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 12,
    name: "Dior B22 Black Reflective",
    price: 2300,
    originalPrice: 2800,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F0ebe16fdd0024a4da3822a9f17207c5b%2F3df9b68f45734740a34b01a257b8d1d1?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2F0ebe16fdd0024a4da3822a9f17207c5b%2F3df9b68f45734740a34b01a257b8d1d1?format=webp&width=800",
    ],
    rating: 4.8,
    brand: "Dior",
    category: "Luxury",
    gender: "men",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 13,
    name: "Air Jordan 4 Retro 'Black Cat'",
    price: 1800,
    originalPrice: 2400,
    image: "/Sneakers photos/blackcat.jpg",
    images: ["/Sneakers photos/blackcat.jpg"],
    rating: 4.9,
    brand: "Jordan",
    category: "Basketball",
    gender: "men",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 28,
    name: "Wmns Air Force 1 Low 'Valentine's Day 2024'",
    price: 1600,
    originalPrice: 2000,
    image: "https://cdn.builder.io/api/v1/image/assets%2F6e6802c7d0d54fd7a1e07e10e69622a6%2F19b53aa36c1e4e8babc4ec5f62ce2982?format=webp&width=800",
    images: ["https://cdn.builder.io/api/v1/image/assets%2F6e6802c7d0d54fd7a1e07e10e69622a6%2F19b53aa36c1e4e8babc4ec5f62ce2982?format=webp&width=800"],
    rating: 4.9,
    brand: "Nike",
    category: "Lifestyle",
    gender: "women",
    condition: "Brand New",
    isNew: true,
    onSale: true,
    sizes: [
      { value: "36", available: true },
      { value: "37", available: true },
      { value: "38", available: true },
      { value: "39", available: true },
      { value: "40", available: true },
    ],
  },
  {
    id: 29,
    name: "Wmns Air Force 1 Low 'Valentine's Day 2023'",
    price: 1600,
    originalPrice: 2000,
    image: "https://cdn.builder.io/api/v1/image/assets%2F56efa7fbb26641429ddbfbaf20815481%2Fb87d5aea0ef54796915a0187a3b31ffc?format=webp&width=800",
    images: ["https://cdn.builder.io/api/v1/image/assets%2F56efa7fbb26641429ddbfbaf20815481%2Fb87d5aea0ef54796915a0187a3b31ffc?format=webp&width=800"],
    rating: 4.8,
    brand: "Nike",
    category: "Lifestyle",
    gender: "women",
    condition: "Brand New",
    isNew: true,
    onSale: true,
    sizes: [
      { value: "36", available: true },
      { value: "37", available: true },
      { value: "38", available: true },
      { value: "39", available: true },
      { value: "40", available: true },
    ],
  },
  {
    id: 30,
    name: "Nike Air Force 1 Low LV8 Double Swoosh Light Armory Blue",
    price: 1600,
    originalPrice: 2000,
    image: "https://cdn.builder.io/api/v1/image/assets%2F6e6802c7d0d54fd7a1e07e10e69622a6%2F1928007903ba488fb8be27e6d32d1911?format=webp&width=800",
    images: ["https://cdn.builder.io/api/v1/image/assets%2F6e6802c7d0d54fd7a1e07e10e69622a6%2F1928007903ba488fb8be27e6d32d1911?format=webp&width=800"],
    rating: 4.7,
    brand: "Nike",
    category: "Lifestyle",
    gender: "women",
    condition: "Brand New",
    isNew: true,
    onSale: true,
    sizes: [
      { value: "36", available: false},
      { value: "37", available: true },
      { value: "38", available: true },
      { value: "39", available: false },
      { value: "40", available: false },
    ],
  },
  {
    id: 14,
    name: "Nike Air Max 97 'Black'",
    price: 1700,
    originalPrice: 2000,
    image: "/Sneakers photos/airmax97blac.jpg",
    images: ["/Sneakers photos/airmax97blac.jpg"],
    rating: 4.7,
    brand: "Nike",
    category: "Lifestyle",
    gender: "unisex",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "38", available: true },
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 15,
    name: "Nike SB Dunk Low Pro Triple White",
    price: 1700,
    originalPrice: 2000,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F0ebe16fdd0024a4da3822a9f17207c5b%2F736ab7a022904b2db7b532f14749f994?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2F0ebe16fdd0024a4da3822a9f17207c5b%2F736ab7a022904b2db7b532f14749f994?format=webp&width=800",
    ],
    rating: 4.8,
    brand: "Nike",
    category: "Skateboarding",
    gender: "unisex",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "38", available: true },
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 16,
    name: "Nike SB Dunk Low Pro Triple Black",
    price: 1700,
    originalPrice: 2000,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F0ebe16fdd0024a4da3822a9f17207c5b%2F749788b45d344459a8e1cb6308243874?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2F0ebe16fdd0024a4da3822a9f17207c5b%2F749788b45d344459a8e1cb6308243874?format=webp&width=800",
    ],
    rating: 4.8,
    brand: "Nike",
    category: "Skateboarding",
    gender: "unisex",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "38", available: true },
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 17,
    name: "Nike SB Dunk Low Fog",
    price: 1700,
    originalPrice: 2000,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F0ebe16fdd0024a4da3822a9f17207c5b%2Fe272d03d70bb43e59469c93880112640?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2F0ebe16fdd0024a4da3822a9f17207c5b%2Fe272d03d70bb43e59469c93880112640?format=webp&width=800",
    ],
    rating: 4.8,
    brand: "Nike",
    category: "Skateboarding",
    gender: "unisex",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "38", available: true },
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 18,
    name: "Nike Air Force 1 Low '07 Black",
    price: 1700,
    originalPrice: 1900,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2F0ebe16fdd0024a4da3822a9f17207c5b%2Fe92a0ef25401402aa50214180125891c?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2F0ebe16fdd0024a4da3822a9f17207c5b%2Fe92a0ef25401402aa50214180125891c?format=webp&width=800",
    ],
    rating: 4.6,
    brand: "Nike",
    category: "Lifestyle",
    gender: "unisex",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "38", available: true },
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 19,
    name: "Air Jordan 4 Retro 'Red Thunder'",
    price: 1800,
    originalPrice: 2400,
    image: "/Sneakers photos/redthunder.jpg",
    images: ["/Sneakers photos/redthunder.jpg"],
    rating: 4.9,
    brand: "Jordan",
    category: "Basketball",
    gender: "men",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "38", available: true },
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  // ...existing code...
  {
    id: 20,
    name: "Nike Dunk Low 'Classic Panda'",
    price: 1700,
    originalPrice: 2300,
    image: "/Sneakers photos/NikeDunkLowRetro‘Panda’.jpg",
    images: ["/Sneakers photos/NikeDunkLowRetro‘Panda’.jpg"],
    rating: 4.7,
    brand: "Nike",
    category: "Lifestyle",
    gender: "unisex",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "38", available: true },
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 21,
    name: "Air Jordan 4 Military Black",
    price: 1800,
    originalPrice: 2450,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fba9233745cae4e74a7f5a545d112e809%2F5fecaf6e9b6d447fb92129f24ffb9ef3?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fba9233745cae4e74a7f5a545d112e809%2F5fecaf6e9b6d447fb92129f24ffb9ef3?format=webp&width=800",
    ],
    rating: 4.8,
    brand: "Jordan",
    category: "Basketball",
    gender: "men",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 22,
    name: "Air Jordan 4 Retro Midnight Navy GS",
    price: 1800,
    originalPrice: 2300,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fba9233745cae4e74a7f5a545d112e809%2Fd37615cb8240424bbf6ed69b80259a36?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fba9233745cae4e74a7f5a545d112e809%2Fd37615cb8240424bbf6ed69b80259a36?format=webp&width=800",
    ],
    rating: 4.7,
    brand: "Jordan",
    category: "Basketball",
    gender: "unisex",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "38", available: true },
      { value: "39", available: true },
      { value: "40", available: true },
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 23,
    name: "Air Jordan 4 Retro SB Navy",
    price: 1800,
    originalPrice: 2500,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fba9233745cae4e74a7f5a545d112e809%2F5605291e183f42fc985f5c6677690c79?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fba9233745cae4e74a7f5a545d112e809%2F5605291e183f42fc985f5c6677690c79?format=webp&width=800",
    ],
    rating: 4.9,
    brand: "Jordan",
    category: "Basketball",
    gender: "men",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 24,
    name: "Air Jordan 4 SE Wet Cement",
    price: 1800,
    originalPrice: 2600,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fba9233745cae4e74a7f5a545d112e809%2Fbf949f44a40449ab81656ea036d14532?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fba9233745cae4e74a7f5a545d112e809%2Fbf949f44a40449ab81656ea036d14532?format=webp&width=800",
    ],
    rating: 4.8,
    brand: "Jordan",
    category: "Basketball",
    gender: "men",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 25,
    name: "Air Jordan 4 White Thunder Retro",
    price: 1800,
    originalPrice: 2400,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fba9233745cae4e74a7f5a545d112e809%2Fbc178b8fa02e47d697271ac9b3a1b9aa?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fba9233745cae4e74a7f5a545d112e809%2Fbc178b8fa02e47d697271ac9b3a1b9aa?format=webp&width=800",
    ],
    rating: 4.9,
    brand: "Jordan",
    category: "Basketball",
    gender: "men",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 26,
    name: "Air Jordan 4 Retro OG SP",
    price: 1800,
    originalPrice: 2700,
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fba9233745cae4e74a7f5a545d112e809%2F333f5e5dd9084d3bb97b303b1ac3bec0?format=webp&width=800",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fba9233745cae4e74a7f5a545d112e809%2F333f5e5dd9084d3bb97b303b1ac3bec0?format=webp&width=800",
    ],
    rating: 4.9,
    brand: "Jordan",
    category: "Basketball",
    gender: "men",
    condition: "Brand New",

    isNew: true,
    onSale: true,
    sizes: [
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
  {
    id: 27,
    name: "AJ1 Retro Low OG 'Sail Shy Pink'",
    price: 1700,
    originalPrice: 2200,
    image: "https://cdn.builder.io/api/v1/image/assets%2Fba9233745cae4e74a7f5a545d112e809%2F5ace7120293944e999b1059359797c6c?format=webp&width=800",
    images: ["https://cdn.builder.io/api/v1/image/assets%2Fba9233745cae4e74a7f5a545d112e809%2F5ace7120293944e999b1059359797c6c?format=webp&width=800"],
    rating: 4.8,
    brand: "Jordan",
    category: "Basketball",
    gender: "unisex",
    condition: "Brand New",
    isNew: true,
    onSale: true,
    sizes: [
      { value: "41", available: true },
      { value: "42", available: true },
      { value: "43", available: true },
      { value: "44", available: true },
      { value: "45", available: true },
    ],
  },
];

// Performance-optimized Loading Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading premium sneakers...</p>
    </div>
  </div>
);

// Router wrapper component that uses useNavigate
function AppRouter() {
  const navigate = useNavigate();

  return <AppContent navigate={navigate} />;
}

// Main App Component - Optimized for Performance
function AppContent({ navigate }) {
  // Initialize mobile enhancements
  useEffect(() => {
    initMobileEnhancements();
  }, []);

  // Performance hooks
  const { loadingStates } = useLoadingStates();
  const filters = useProductFilters(products);

  // Cart context
  const { addToCart: addToCartContext, clearCart: clearCartContext } = useCart();

  // Local state for UI
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [successNotification, setSuccessNotification] = useState(null);
  const [showSafariDiagnostic, setShowSafariDiagnostic] = useState(false);

  // Cart function using CartContext
  const addToCart = useCallback(
    async (product) => {
      const loadingKey = `add-${product.id}`;

      try {
        // Start loading state
        loadingStates.setLoading(loadingKey, true);

        // Use CartContext addToCart
        await addToCartContext(product, product.quantity || 1, product.selectedSize);

        // Success notification
        setSuccessNotification({
          message: `${product.name} added to cart!`,
          onViewCart: () => {
            window.location.href = "/cart";
          },
          onClose: () => setSuccessNotification(null),
        });

        // Auto-hide notification after 3 seconds
        setTimeout(() => {
          setSuccessNotification(null);
        }, 3000);
      } catch (error) {
        console.error("Error adding to cart:", error);
      } finally {
        loadingStates.setLoading(loadingKey, false);
      }
    },
    [addToCartContext, loadingStates],
  );

  const clearCart = useCallback(() => {
    clearCartContext();
  }, [clearCartContext]);

  // Quick View functions
  const openQuickView = useCallback((product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  }, []);

  const closeQuickView = useCallback(() => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  }, []);

  const handleBuyNow = useCallback((product) => {
    // Clear cart and add only this product
    clearCartContext();
    addToCartContext(product, product.quantity || 1, product.selectedSize);
    // Use React Router navigation instead of window.location
    setTimeout(() => {
      navigate("/checkout");
    }, 120);
  }, [navigate, clearCartContext, addToCartContext]);

  return (
    <div className="App min-h-screen overflow-x-hidden">
        <SafariNotificationBanner onOpenDiagnostic={() => setShowSafariDiagnostic(true)} />
        <Navigation
          searchTerm={filters.searchTerm}
          setSearchTerm={filters.setSearchTerm}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          products={products}
        />

        <main>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    filteredProducts={filters.filteredProducts}
                    brands={filters.brands}
                    selectedBrand={filters.selectedBrand}
                    setSelectedBrand={filters.setSelectedBrand}
                    openQuickView={openQuickView}
                    addToCart={addToCart}
                    loadingStates={loadingStates}
                  />
                }
              />
              <Route
                path="/products"
                element={
                  <ProductsPage
                    filteredProducts={filters.filteredProducts}
                    brands={filters.brands}
                    selectedBrand={filters.selectedBrand}
                    setSelectedBrand={filters.setSelectedBrand}
                    searchTerm={filters.searchTerm}
                    setSearchTerm={filters.setSearchTerm}
                    openQuickView={openQuickView}
                    addToCart={addToCart}
                    loadingStates={loadingStates}
                  />
                }
              />
              <Route
                path="/mens-shoes"
                element={
                  <MensShoesPage
                    products={products.filter(
                      (p) =>
                        (p.gender && p.gender.toLowerCase() === "men") ||
                        p.gender === "unisex",
                    )}
                    openQuickView={openQuickView}
                    addToCart={addToCart}
                    loadingStates={loadingStates}
                  />
                }
              />
              <Route
                path="/womens-shoes"
                element={
                  <WomensShoesPage
                    products={products.filter(
                      (p) =>
                        (p.gender && p.gender.toLowerCase() === "women") ||
                        p.gender === "unisex",
                    ).sort((a, b) => {
                      // Prioritize new women's Nike AF1 products (IDs 28, 29, 30)
                      const priorityIds = [28, 29, 30];
                      const aIsPriority = priorityIds.includes(a.id);
                      const bIsPriority = priorityIds.includes(b.id);

                      if (aIsPriority && !bIsPriority) return -1;
                      if (!aIsPriority && bIsPriority) return 1;
                      if (aIsPriority && bIsPriority) {
                        // Sort priority items by ID (28, 29, 30)
                        return priorityIds.indexOf(a.id) - priorityIds.indexOf(b.id);
                      }
                      return 0; // Keep original order for non-priority items
                    })}
                    openQuickView={openQuickView}
                    addToCart={addToCart}
                    loadingStates={loadingStates}
                  />
                }
              />
              <Route
                path="/brands"
                element={
                  <BrandsPage
                    products={products}
                    brands={filters.brands}
                    selectedBrand={filters.selectedBrand}
                    setSelectedBrand={filters.setSelectedBrand}
                    openQuickView={openQuickView}
                    addToCart={addToCart}
                    loadingStates={loadingStates}
                  />
                }
              />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route
                path="/product/:slug"
                element={
                  <ProductDetailPage
                    products={products}
                    onAddToCart={addToCart}
                    loadingStates={loadingStates}
                  />
                }
              />
              <Route
                path="/order-confirmation"
                element={<OrderConfirmation />}
              />
              <Route
                path="/safari-test"
                element={<SafariTestPage />}
              />

            </Routes>
          </Suspense>
        </main>

        <Suspense fallback={<div></div>}>
          <Footer />
          <WhatsAppFloat />

          <QuickViewModal
            product={quickViewProduct}
            isOpen={isQuickViewOpen}
            onClose={closeQuickView}
            onAddToCart={addToCart}
            onBuyNow={handleBuyNow}
            loadingStates={loadingStates}
          />

          {successNotification && (
            <SuccessNotification
              message={successNotification.message}
              onViewCart={successNotification.onViewCart}
              onClose={successNotification.onClose}
            />
          )}

          <SafariDiagnostic isVisible={showSafariDiagnostic} />
          {showSafariDiagnostic && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowSafariDiagnostic(false)}
            />
          )}
        </Suspense>
      </div>
  );
}

// Main App wrapper with Router
function App() {
  return (
    <Router>
      <AppRouter />
    </Router>
  );
}

export default App;
