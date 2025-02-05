import { SortReposBy } from "@/app/account/dashboard/page";
import { isClient } from "./is-client";

function getSortReposBy(): SortReposBy {
  if (!isClient()) {
    return "major dep updates";
  }

  return (
    (localStorage.getItem("sortReposBy") as SortReposBy) || "major dep updates"
  );
}

function setSortReposBy(sortBy: SortReposBy) {
  if (!isClient()) {
    return;
  }

  localStorage.setItem("sortReposBy", sortBy);
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
  getSignUpTermsAccepted,
  setSignUpTermsAccepted,
  getCookiesConsent,
  setCookiesConsent,
  getSortReposBy,
  setSortReposBy,
};
