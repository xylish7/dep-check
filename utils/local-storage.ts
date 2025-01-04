import { CartProduct } from "@/providers/cart";
import { isClient } from "./is-client";

const CART_PRODUCTS = "cart-products";

function getCartProducts(): CartProduct[] {
  if (!isClient()) {
    return [];
  }

  const products = localStorage.getItem(CART_PRODUCTS);
  if (products) {
    return JSON.parse(products) as CartProduct[];
  }

  return [];
}

function setCartProducts(products: CartProduct[]) {
  if (!isClient()) {
    return;
  }
  localStorage.setItem(CART_PRODUCTS, JSON.stringify(products));
}

function getSignUpTermsAccepted() {
  if (!isClient()) {
    return false;
  }

  return localStorage.getItem("signUpTermsAccepted") === "true";
}

function setSignUpTermsAccepted() {
  if (!isClient()) {
    return;
  }

  localStorage.setItem("acceptedTerms", "true");
}

function getCookiesConsent(): "yes" | "no" | "undecided" {
  if (!isClient()) {
    return "no";
  }

  if (localStorage.getItem("cookiesConsent")) {
    return localStorage.getItem("cookiesConsent") as "yes" | "no";
  }

  return "undecided";
}

function setCookiesConsent(consent: "yes" | "no") {
  if (!isClient()) {
    return;
  }

  localStorage.setItem("cookiesConsent", consent);
}

export const storage = {
  getCartProducts,
  setCartProducts,
  getSignUpTermsAccepted,
  setSignUpTermsAccepted,
  getCookiesConsent,
  setCookiesConsent,
};
